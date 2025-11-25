const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./db');
const session = require('express-session');
const pool = require('./db');
const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number


//Get login Form
router.get('/login', (req, res) => {
    ejs.renderFile('./views/login.ejs', {session: req.session}, (err, html) => {
        if (err) {
           
            req.session.error = 'Internal Server Error'
            req.session.severity = 'danger'
            return;
        }
        res.send(html);
    });
    req.session.body = null
});
//Post login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    req.session.body = req.body;

    if (!email || !password) {
        req.session.error = 'All fields are required';
        req.session.severity = 'danger';
        return res.redirect('/users/login');
    }

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {

            if (err) {
                req.session.error = 'Internal Server Error';
                req.session.severity = 'danger';
                return res.redirect('/users/login');
            }

            if (results.length === 0) {
                req.session.error = 'Invalid email or password';
                req.session.severity = 'danger';
                return res.redirect('/users/login');
            }

            // 100% helyes user objektum
            req.session.user = {
                id: results[0].id,
                name: results[0].name,
                email: results[0].email
            };

            return res.redirect('/');
        }
    );
});

//Get registration form
router.get('/registration', (req, res) => {
    
    ejs.renderFile('./views/registration.ejs', {session: req.session}, (err, html) => {
        if (err) {
            
            req.session.error = 'Error rendering EJS file!'
            req.session.severity = 'danger'
            return res.redirect('/users/registration');
        }
        res.send(html);
    });
    
    req.session.body = null
});
//Post registration
router.post('/registration', (req, res) => {
    const { name, email, password, confpassword } = req.body;
    req.session.body = req.body
  
   
   
    if (!name || !email || !password || !confpassword) {
         req.session.error = 'All fields are required!'
        req.session.severity = 'danger'
        return res.redirect('/users/registration');
    }
    if (password !== confpassword) {
         req.session.error = 'Passwords do not match'
        req.session.severity = 'danger'
        return res.redirect('/users/registration');
    }
    if (!passwordregex.test(password)) {
         req.session.error = 'Password must be at least 8 characters long and contain at least one letter and one number'
        req.session.severity = 'danger'
        return res.redirect('/users/registration');
    }

    db.query('SELECT * FROM users WHERE email = ? ', [email], (err, results) => {
        
        
        if (err) {
           
            req.session.error = 'Internal Server Error'
             req.session.severity = 'danger'
             return res.redirect('/users/registration');
            }
        if (results.length > 0) {
            req.session.error = 'Létezik már ilyen emailen ember'
            req.session.severity = 'danger'
            return res.redirect('/users/registration');
        }
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
            if (err) {
                console.log('Error inserting user into database:', err);
                req.session.error = 'Passwords do not match'
              req.session.severity = 'danger'
              return res.redirect('/users/registration');
            }
            req.session.error='Sikeres regisztráció'
            req.session.severity="success"
            res.redirect('/users/login');
       });
    
        });
    });
    
    //Logout
    router.get("/logout", (req,res)=>{
        req.session.user = null;
        res.redirect('/users/login');
    })



 

module.exports = router;