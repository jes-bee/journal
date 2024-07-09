const express=require('express');
const sqlite=require('sqlite3').verbose();
const path=require('path');
const app=express();
const PORT=3000;
const DB=new sqlite.Database('./database.db', (err) => {
    if (err) {
        console.error('Oops, there\'s an error!', err);
    }
    else{
        console.log('Yay, you did it!');
    }
});