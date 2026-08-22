const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskdb',
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If local MongoDB is not running, log detailed message but don't crash process immediately if handled
    console.log('Ensure MongoDB server is running on mongodb://127.0.0.1:27017/taskdb');
  }
};

module.exports = connectDB;
