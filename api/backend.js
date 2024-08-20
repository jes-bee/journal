const env = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
// const cors = require('cors');
const express = require('express');
// const router = require('./app');

const app = express();
app.use('/api', require('./app'));
const envPath = path.resolve(__dirname, '../.env');
env.config({path:envPath});

// app.use(cors());
// app.use(express.json());

const pool = new Pool({
    connectionString: process.env.NODE_SB,

});

// Database query function
const query = (text, params) => pool.query(text, params);

module.exports.query = {query}; // Export the query function for use in routes

// // Use the routes defined in routes.js
// app.use('/api', router);

// module.exports = app; // Export the Express app for Vercel

