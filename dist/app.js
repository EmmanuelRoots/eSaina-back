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
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use(express_1.default.static('swagger'));
exports.app.get('/', (req, res) => {
    res.send('Hello');
});
const swaggerDocument = JSON.parse(fs_1.default.readFileSync('swagger/swagger.json', 'utf8'));
exports.app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
(0, routes_1.RegisterRoutes)(exports.app);
