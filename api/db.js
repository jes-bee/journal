const { Pool } = require('pg');
const path = require('path');
const env = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
env.config({ path: envPath });

const pool = new Pool({
    connectionString: process.env.NODE_SB,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
