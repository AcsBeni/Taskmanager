require('dotenv').config();
const express = require('express');
var session = require('express-session')
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;


//Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));
app.use(session({
    secret  : process.env.SESSION_SECRET
}));
//Routes
const core = require('./modules/core');
app.use('/', core);

const users = require('./modules/users');
app.use('/users', users);

const tasks = require('./modules/tasks');
app.use('/tasks', tasks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


