const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./db');
var moment = require('moment');

router.get('/', loginCheck, (req, res) => {

    db.query(`SELECT * FROM tasks WHERE userId=?`, [req.session.user.id], (err, results) => {

        if (err){
            console.log(err);
            req.session.error = 'Adatbázis hiba!';
            req.session.severity = 'danger';
            return res.redirect('/tasks');  
        }

        results.forEach(item => {
            item.start = moment(item.start).format('YYYY-MM-DD');
            item.end = moment(item.end).format('YYYY-MM-DD');
        });

        ejs.renderFile('./views/tasks.ejs', { session: req.session, results }, (err, html) => {
            if (err) {
                console.log(err);
                return
            }
            req.session.error = '';
            req.session.body = null;
            res.send(html);
        });

    });
   
});

//Módosítás blabla
router.get('/edit/:id', loginCheck, (req, res) => {
    const id = req.params.id;

    db.query(`SELECT * FROM tasks WHERE id=?`, [id], (err, results) => {
        if (err){
            console.log(err);
            req.session.error = 'Adatbázis hiba!';
            req.session.severity = 'danger';
            return res.redirect('/tasks');  
        }

        if (results.length === 0){
            req.session.error = 'Nincs ilyen feladat!';
            req.session.severity = 'warning';
            return res.redirect('/tasks');
        }

        const data = results[0];

        data.start = moment(data.start).format('YYYY-MM-DD');
        data.end = moment(data.end).format('YYYY-MM-DD');

        ejs.renderFile('./views/taskedit.ejs', { 
            session: req.session, 
            id,
            data
        }, (err, html) => {
            if (err) {
                console.log(err);
                return;
            }
            req.session.error = '';
            req.session.body = null;
            res.send(html);
        });
    });
});
router.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    db.query(
        'UPDATE tasks SET title=? WHERE id=?',
        [title, id],
        (err, result) => {
            if (err) {
                req.session.error = 'Hiba történt mentésnél!';
                req.session.severity = 'danger';
                return res.redirect(`/edit/${id}`);
            }
            res.redirect('/tasks');
        }
    );
});
//Feladat törlése
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    ejs.renderFile(
        './views/taskdelete.ejs',
        { session: req.session, id: id },  
        (err, html) => {
            if (err) {
                res.status(500).send('Error rendering page: ' + err);
            } else {
                req.session.error = '';
                res.send(html);
            }
        }
    );
});
router.post('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM tasks WHERE id=?', [id], (err, result) => {
        if (err) {
            req.session.error = 'Hiba történt törlésnél!'
            req.session.severity = 'danger'
            return res.redirect('/');
        }
        res.redirect('/tasks');
    });
});


router.get('/calendar', loginCheck, (req, res) => {

    let calEvents = [];

    db.query(`SELECT * FROM tasks WHERE userId=?`, [req.session.user.id], (err, results) => {

        if (err){
            console.log(err);
            req.session.error = 'Adatbázis hiba!';
            req.session.severity = 'danger';
            return res.redirect('/tasks');  
        }
    
        results.forEach(item => {
            calEvents.push({
                    title   : item.title,
                    start   : moment(item.start).format('YYYY-MM-DD'),
                    end     : moment(item.end).format('YYYY-MM-DD')
            });
        });
        
        ejs.renderFile('./views/calendar.ejs', { session: req.session, calEvents }, (err, html) => {
            if (err) {
                console.log(err);
                return
            }
            req.session.error = '';
            req.session.body = null;
            res.send(html);
        });

    });


   

});

function loginCheck(req, res, next){
    if (req.session.user){
        return next();
    }
    return res.redirect('/users/login');
}

module.exports = router;