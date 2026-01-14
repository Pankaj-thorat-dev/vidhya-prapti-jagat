"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
/**
 * Load environment variables
 */
dotenv_1.default.config();
/**
 * Server configuration
 */
const PORT = process.env.PORT || 5000;
/**
 * Start server
 */
const startServer = async () => {
    // Connect to database (non-blocking)
    await (0, database_1.connectDB)();
    // Start listening
    const server = app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
    // Handle port already in use error
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
            console.log('💡 Solutions:');
            console.log(`   1. Kill the process: taskkill /F /PID <process_id>`);
            console.log(`   2. Change PORT in .env file to a different port (e.g., 5001)`);
            console.log(`   3. Find process using port: Get-NetTCPConnection -LocalPort ${PORT}`);
            process.exit(1);
        }
        else {
            console.error('❌ Server error:', error);
            process.exit(1);
        }
    });
};
startServer();
