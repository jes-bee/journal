const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');
const env = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
env.config({path:envPath});

// Database configuration
const pool = new Pool({
  connectionString: process.env.NODE_SB,
  ssl: {
    rejectUnauthorized: false
  }
});

// Encryption function
function encrypt(text) {
    if (typeof text !== 'string') {
        throw new TypeError('Expected a string for encryption');
    }
  const algorithm = 'aes-256-ctr';
  const secretKey = process.env.KEY || 'mystrongsecretkey';
  if (!secretKey || secretKey.length !== 64) {
    throw new Error('SECRET_KEY must be a 32-byte hexadecimal string (64 characters long)');
  }
  const keyBuffer = Buffer.from(secretKey, 'hex');

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to parse CSV and insert into database
async function parseCSVAndInsert(filePath, category) {
  const results = [];

  // Read CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
        const description = data[[Object.keys(data)[0]]];
        if (description && typeof description === 'string') {
            results.push({ description });
          } else {
            console.error('Unexpected row format or missing description:', data);
          }
    })
    .on('end', async () => {
        const insertPromises = results.map(async (row) => {
          // Debugging information
          console.log(`Processing row: ${JSON.stringify(row)}`);
          
          if (typeof row.description === 'undefined') {
            console.error('Invalid data found in row:', row);
            return;
          }
  
        //   const name = encrypt('Hardcoded Name'); // Hardcoded name
          const description = row.description;
          const encryptedDesc = encrypt(description);
        //   console.log(encryptedDesc);
  
          try {
            await pool.query(
              'INSERT INTO prompt (category, prompt) VALUES ($1, $2)',
              [category, encryptedDesc]
            );
          } catch (err) {

            console.error(`Error inserting row: ${err.message}`);
          }
        });

      try {
        await Promise.all(insertPromises);
        console.log('CSV file successfully processed and data inserted.');
      } catch (err) {
        if (err instanceof AggregateError) {
          err.errors.forEach((individualError) => {
            console.error(`Individual error: ${individualError.message}`);
          });
        } else {
          console.error(`General error: ${err.message}`);
        }
      } finally {
        pool.end();
      }
    });
}

// Usage example
const filePath = '../dailyreflection.csv'; // Path to your CSV file
const category = 'dailyreflection'; // Your hardcoded category
parseCSVAndInsert(filePath, category);
