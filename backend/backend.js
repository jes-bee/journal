const env = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const envPath = path.resolve(__dirname, '../.env');
env.config({path:envPath});


const pool = new Pool({
    connectionString: process.env.NODE_SB,
    ssl: {
        rejectUnauthorized: false
    }
    
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};

