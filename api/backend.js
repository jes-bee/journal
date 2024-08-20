const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('dotenv');

const app = express();
const envPath = path.resolve(__dirname, '../.env');
env.config({ path: envPath });

// Middleware
app.use(cors());
app.use(express.json());

// Import and mount routes
app.use('/api', require('./app'));

// Export the Express app for Vercel
module.exports = app;
