"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const features_1 = require("../config/features");
async function loadRoutes(app) {
    const { default: studyRoutes } = await Promise.resolve().then(() => __importStar(require('../modules/study/study.routes')));
    const { default: mocksRoutes } = await Promise.resolve().then(() => __importStar(require('../modules/mocks/mocks.routes')));
    const { default: analyticsRoutes } = await Promise.resolve().then(() => __importStar(require('../modules/analytics/analytics.routes')));
    const { default: lifestyleRoutes } = await Promise.resolve().then(() => __importStar(require('../modules/lifestyle/lifestyle.routes')));
    const { default: usersRoutes } = await Promise.resolve().then(() => __importStar(require('../modules/users/users.routes')));
    app.use('/api/study', studyRoutes);
    app.use('/api/mocks', mocksRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/lifestyle', lifestyleRoutes);
    app.use('/api/users', usersRoutes);
    console.log('✅ All routes registered');
}
async function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    }));
    app.options('*', (0, cors_1.default)());
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use((0, morgan_1.default)('dev'));
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            features: features_1.FEATURE_CONFIG.map((f) => ({
                name: f.name,
                enabled: f.enabled,
            })),
        });
    });
    await loadRoutes(app);
    app.use((_req, res) => {
        res.status(404).json({ success: false, message: 'Route not found' });
    });
    app.use((err, _req, res, _next) => {
        console.error(err.stack);
        res.status(500).json({ success: false, message: err.message });
    });
    return app;
}
