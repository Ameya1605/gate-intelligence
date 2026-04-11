"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const database_1 = require("./database");
const PORT = process.env.PORT ?? 4000;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/gate-intelligence';
async function bootstrap() {
    await (0, database_1.connectDatabase)(MONGO_URI);
    const app = await (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`🚀 GATE Intelligence Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
}
bootstrap().catch((err) => {
    console.error('Fatal bootstrap error:', err);
    process.exit(1);
});
