const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });
require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());

//linking router files
app.use(require('./router/auth'));

const PORT = process.env.PORT;

// Middleware

const middleware = (req, res, next) => {
    console.log(`Hello middleware `);
    next();
}

// app.get('/', (req, res) => {
//     res.send(`Home`);
// });
app.get('/about', middleware, (req, res) => {
    console.log(`Hello About `);
    res.send(`About`);
});
app.get('/contact', (req, res) => {
    res.send(`Contact`);
});
app.get('/signin', (req, res) => {
    res.send(`Login`);
});
app.get('/signup', (req, res) => {
    res.send(`Register`);
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})