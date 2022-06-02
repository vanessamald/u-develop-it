// import express 
const express = require('express');

const mysql = require('mysql2');

// port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // mysql username,
        user : 'root',
        // mysql password
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// query the database to test the connection
//db.query(`SELECT * FROM candidates`, (err, rows) => {
    //console.log(rows);
//});

// GET a single candidate
db.query('SELECT * FROM candidates WHERE id =1', (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});

// delete a candidate
//db.query(`DELETE FROM candidates WHERE id = ?` , 1, (err, result) => {
    //if (err) {
       // console.log(err);
    //}
    //console.log(result);
//});

// create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// default response for any other request (Not found)
app.use((req, res) => {
    res.status(404).end();
});

// add function to start express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
