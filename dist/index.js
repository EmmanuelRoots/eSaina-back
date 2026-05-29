"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_middleware_1 = require("./api/middleware/exception.middleware");
const app_1 = require("./app");
require("./api/controllers/project-statuses.controller");
app_1.app.use(exception_middleware_1.ExceptionMiddleware);
app_1.app.listen(process.env.PORT, async () => {
    console.log('server stated at', process.env.PORT);
});
