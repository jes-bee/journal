const express = require('express');
const cors = require('cors');
const env = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const envPath = path.resolve(__dirname, '../.env');
env.config({ path: envPath });

// Middleware
app.use(cors());
app.use(express.json());

// Import and mount routes
app.use('/api', require('./app'));

const pool = new Pool({
    connectionString: process.env.NODE_SB,
    ssl: {
        rejectUnauthorized: false
    }
});

// Database query function
const query = (text, params) => pool.query(text, params);

// Export the query function
module.exports = { query };

// Export the Express app for Vercel
module.exports = app;
