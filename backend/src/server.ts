import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

/**
 * Load environment variables
 */
dotenv.config();

/**
 * Server configuration
 */
const PORT = process.env.PORT || 5000;

/**
 * Start server
 */
const startServer = async (): Promise<void> => {
  // Connect to database (non-blocking)
  await connectDB();

  // Start listening
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  });

  // Handle port already in use error
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.log('💡 Solutions:');
      console.log(`   1. Kill the process: taskkill /F /PID <process_id>`);
      console.log(`   2. Change PORT in .env file to a different port (e.g., 5001)`);
      console.log(`   3. Find process using port: Get-NetTCPConnection -LocalPort ${PORT}`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });
};

startServer();