var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/users');
var shoppingRouter = require('./routes/shopping');

var cors = require('cors');

var app = express();
app.use(cors());

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '3.0.56.213',
    user: 'fortest',
    password: 'Pa55w0rd',
    database: 'shoppingdb'
})
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRouter(connection));
app.use('/api/shopping', shoppingRouter(connection));

module.exports = app;
