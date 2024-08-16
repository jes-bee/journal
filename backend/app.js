const path = require('path');
const cors = require('cors');
const env = require('dotenv');
const express = require('express');
const db = require('./backend');
const crypto = require('crypto');
const app = express();
const envPath = path.resolve(__dirname, '../.env');
env.config({path:envPath});
const PORT = 5500;

app.use(express.json());
app.use(cors());

function decrypt(text){
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.KEY || 'mystrongsecretkey';

    if (!secretKey || secretKey.length !== 64) {
        throw new Error('SECRET_KEY must be a 32-byte hexadecimal string (64 characters long)');
    }
    const keyBuffer = Buffer.from(secretKey, 'hex');
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString();
}



app.post('/prompt', async (req, res) => {

    const { category } = req.body;

    if (!category){
        return res.status(400).send('Category is required');
    }

    try {
        const result = await db.query(
            'select prompt from prompt '+
            'where category = $1 '+
            'order by random() limit 1 ',
            [category]
        );

        const encryptedRes = result.rows[0];
        const decrypted = decrypt(encryptedRes.prompt);

        const data = {
            ...encryptedRes,
            prompt: decrypted
        };

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unexpected Error');
    }
});

app.get('/randPrompts', async(req, res) => {
    try {
        const result = await db.query(
            'select prompt from prompt '+
            'order by random() limit 1 '
        );

        const encryptedRes = result.rows[0];
        const decrypted = decrypt(encryptedRes.prompt);

        const data = {
            ...encryptedRes,
            prompt: decrypted
        };

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).send('Unexpected Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});