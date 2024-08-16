const env = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const routes = require('./app');
const express = require('express');
const app = express();
const envPath = path.resolve(__dirname, '../.env');
env.config({path:envPath});
app.use(cors());

const pool = new Pool({
    connectionString: process.env.NODE_SB,
    ssl: {
        rejectUnauthorized: false
    }
    
});

// Database query function
const query = (text, params) => pool.query(text, params);

module.exports.query = query; // Export the query function for use in routes

// Use the routes defined in routes.js
app.use('/api', routes);

module.exports = app; // Export the Express app for Vercel

