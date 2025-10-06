"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_middleware_1 = require("./api/middleware/exception.middleware");
const app_1 = require("./app");
app_1.app.use(exception_middleware_1.ExceptionMiddleware);
app_1.app.listen(process.env.PORT, async () => {
    console.log('server stated at', process.env.PORT);
});
