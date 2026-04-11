"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDatabase(uri) {
    try {
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
}
async function disconnectDatabase() {
    await mongoose_1.default.disconnect();
    console.log('🔌 MongoDB disconnected');
}
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
