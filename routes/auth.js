let express = require('express');
let router = express.Router();
const { findByEmail } = require('../storage/users');
const argon2 = require('argon2');
const mongodb = require('../storage/mongoDB')


router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', async function (req, res, next) {
    console.log(req.body.email)
    const user = await mongodb.findOneUserByEmail(req.body.email);
    console.log(user)
    console.log(user.password)
    console.log(user)
    if (user) {
        if (await argon2.verify(user.password, req.body.password)) {
            req.session.user = user;
            req.flash('success', 'Bonjour ' + user.email);
            res.redirect('/');
        } else {
            res.render('login', { flashError: 'Email ou mot de passe incorrect', email: req.body.email });
        }
    } else {
        res.render('login', { flashError: 'Email ou mot de passe incorrect', email: req.body.email });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;