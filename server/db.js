// server/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env variables right here to ensure they are available
dotenv.config(); 

const connectDB = async () => {
    // 1. Extract credentials from the full URI
    const uri = process.env.MONGO_URI;
    
    // We will assume the URI is correctly formatted and just try to connect
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully! ✅');
    } catch (err) {
        console.error('MongoDB connection error: Check username, password, and Network Access in Atlas.', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;