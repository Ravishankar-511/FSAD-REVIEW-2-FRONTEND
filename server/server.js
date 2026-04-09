// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db'); 

// Load config and connect to DB
dotenv.config();
connectDB(); 

const app = express();
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:1006' })); // React App URL

// Import and use API routes
const professionalsRoute = require('./routes/professionals');
app.use('/api/professionals', professionalsRoute); 

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));