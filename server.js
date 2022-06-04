// import express 
const express = require('express');

const mysql = require('mysql2');

// import inputCheck module
const inputCheck = require('./utils/inputCheck');

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

// get all candidates
    // api/candidates refers to the api endpoint
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            // status code 500 indicates a server error
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delete a candidate
    // http request method of delete() including a route parameter 
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params =[req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// create a candidate
    // using the http request method post() to insert a candidate into the candidates table
        // using the /api/candidate endpoint 
            // using object destructuring to pull the body property out of the request object
app.post('/api/candidate', ({ body }, res) => {
    // assign error to receive the return from the inputCheck function 
    // inputCheck module inserted at top of page
    const errors = inputCheck(
        body,
        'first_name',
        'last_name', 
        'industry_connected'
        );
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    
    const sql = `INSERT INTO candidates (first_name, last_name, industry,connected)
    VALUES (?,?,?)`;
    // params assignment contains three elements
    const params = [body.first_name, body.last_name, body.industry_connected];
    // using the query method we can execute the sql statement 
    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message});
        return;
    }
    // send the response
    res.json({
        message: 'success',
        data: body
        });
    });
});

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
