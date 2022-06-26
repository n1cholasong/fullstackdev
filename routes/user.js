const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureAuthenticated = require("../helpers/auth");

router.get('/login', (req, res) => {
    res.render('./user/login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        // Success redirect URL
        successRedirect: '/',
        // Failure redirect URL
        failureRedirect: '/user/login',
        /* Setting the failureFlash option to true instructs Passport to flash
        an error message using the message given by the strategy's verify callback.
        When a failure occur passport passes the message object as error */
        failureFlash: true
    })(req, res, next);
});

router.get('/signup', (req, res) => {
    res.render('./user/signup');
})

router.post('/signup', async function (req, res) {
    let { email, username, password, password2 } = req.body;
    let isValid = true;

    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        res.render('user/signup', {
            email, username
        });
        return;
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' alreay registered');
            res.render('user/signup', {
                email, username
            });
        }
        else {
            // Create new user record
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            var role = "test_role"
            // Use hashed password
            let user = await User.create({ email, username, password: hash, role });
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/user/login');
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

router.get('/profile/:id', async (req, res) => {
    // future updgrades
    // let user = await User.findByPk(req.params.id);
    // console.log("Test: " + user.username);
    res.render('./user/profile');
});

router.post('/updateAccount/:id', (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    User.update(
        {
            email, username
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' user updated');
            res.redirect('/user/profile/:id');
        })
        .catch(err => console.log(err));
});

module.exports = router;