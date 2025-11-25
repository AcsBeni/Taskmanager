const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./db');
const session = require('express-session');
const pool = require('./db');



router.get('/', (req, res) => {
    ejs.renderFile('./views/index.ejs', {session: req.session}, (err, html) => {
        if (err) {
            console.log('Error rendering EJS file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(html);
    });
});
 

module.exports = router;