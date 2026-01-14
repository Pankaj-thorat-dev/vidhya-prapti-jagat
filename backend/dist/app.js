"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
const streamRoutes_1 = __importDefault(require("./routes/streamRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
/**
 * Initialize Express application
 */
const app = (0, express_1.default)();
/**
 * Middleware
 */
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * Serve static files (uploaded PDFs)
 */
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
/**
 * API Routes
 */
app.use('/api/auth', authRoutes_1.default);
app.use('/api/boards', boardRoutes_1.default);
app.use('/api/streams', streamRoutes_1.default);
app.use('/api/subjects', subjectRoutes_1.default);
app.use('/api/notes', noteRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
/**
 * Health check route
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
/**
 * API status route (no database required)
 */
app.get('/api/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        endpoints: {
            auth: '/api/auth',
            boards: '/api/boards',
            streams: '/api/streams',
            subjects: '/api/subjects',
            notes: '/api/notes',
            orders: '/api/orders',
        },
        database: 'Connect MongoDB to enable all features - see MONGODB_SETUP.md',
    });
});
/**
 * 404 handler
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
/**
 * Global error handler
 */
app.use(errorHandler_1.errorHandler);
exports.default = app;
