import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesdb';
    
    // Connection options to handle IPv6/IPv4 issues
    const options = {
      family: 4, // Force IPv4
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
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
