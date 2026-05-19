"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./api/routes/routes");
const fs_1 = __importDefault(require("fs"));
const sse_sa_1 = __importDefault(require("./service/applicative/sse.sa"));
const repository_1 = require("./repository");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Ton frontend Vite
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Autoriser explicitement la méthode OPTIONS pour le preflight
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Indispensable si ton frontend envoie des cookies ou des tokens d'autorisation
}));
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use(express_1.default.static("swagger"));
exports.app.get("/", (req, res) => {
    res.send("Hello");
});
exports.app.get("/notification/stream", async (req, res) => {
    const userId = req.query.userId;
    if (!userId)
        return res.status(400).send("userId manquant");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const clientId = sse_sa_1.default.addClient(userId, res);
    await repository_1.prisma.user.update({
        where: { id: userId },
        data: {
            connected: true,
        },
    });
    res.write(`event: CONNECTED\ndata: ${JSON.stringify({ userId, clientId })}\n\n`);
    console.log("Client connecte");
    req.on("close", async () => {
        await repository_1.prisma.user.update({
            where: { id: userId },
            data: {
                connected: false,
            },
        });
        console.log("client deconnecte");
        sse_sa_1.default.removeClient(clientId);
    });
});
const swaggerDocument = JSON.parse(fs_1.default.readFileSync("swagger/swagger.json", "utf8"));
exports.app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
(0, routes_1.RegisterRoutes)(exports.app);
