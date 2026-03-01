
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Database Host: ${conn.connection.host}`);
    console.log(`📍 Database Name: ${conn.connection.name}`);

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Exit the process with failure - prevents server from running without DB
    process.exit(1);
  }
};

module.exports = connectDB;