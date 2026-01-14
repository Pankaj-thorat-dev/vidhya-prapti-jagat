"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesdb';
        // Connection options to handle IPv6/IPv4 issues
        const options = {
            family: 4, // Force IPv4
        };
        const conn = await mongoose_1.default.connect(mongoUri, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('\n⚠️  WARNING: Server will continue without database connection.');
        console.log('📝 To fix this:');
        console.log('   1. Check if MongoDB is running: mongosh');
        console.log('   2. Verify MONGO_URI in .env uses 127.0.0.1 (not localhost)');
        console.log('   3. Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas\n');
        // Don't exit - allow server to start for development
        // process.exit(1);
    }
};
exports.connectDB = connectDB;
