import cors from "cors";
import Express from "express";
import swaggerUI from "swagger-ui-express";

import { RegisterRoutes } from "./api/routes/routes";

import fs from "fs";
import { authMiddleware } from "./api/middleware/auth.middleware";
import sseSa from "./service/applicative/sse.sa";
import { prisma } from "./repository";

export const app = Express();

// CORS_ORIGIN est injecté depuis .env en production (ex. https://sales.boost.arkeup.com).
// En dev, on retombe sur l'origine Vite locale.
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  }),
);
app.use(Express.json({ limit: "50mb" }));
app.use(Express.static("swagger"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/notification/stream", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).send("userId manquant");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const clientId = sseSa.addClient(userId, res)
  await prisma.user.update({
    where: { id: userId },
    data: {
      connected: true,
    },
  });
  res.write(
    `event: CONNECTED\ndata: ${JSON.stringify({ userId, clientId })}\n\n`,
  );
  console.log("Client connecte");

  req.on("close", async () => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        connected: false,
      },
    });
    console.log("client deconnecte");

    sseSa.removeClient(clientId);
  });
});

const swaggerDocument = JSON.parse(
  fs.readFileSync("swagger/swagger.json", "utf8"),
);
app.use(
  "/swagger",
  swaggerUI.serve as unknown[] as Express.RequestHandler[],
  swaggerUI.setup(swaggerDocument) as unknown as Express.RequestHandler,
);

RegisterRoutes(app);
