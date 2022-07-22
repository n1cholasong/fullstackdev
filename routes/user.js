const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureAuthenticated = require("../helpers/auth");
const moment = require('moment');
const countryList = require('country-list');

router.get('/login', (req, res) => {
    title = "Log in";
    res.render('./user/login', { title });
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
    title = "Sign Up";
    country = countryList.getData();
    res.render('./user/signup', { title, country });
})

router.post('/signup', async function (req, res) {
    let { email, username, password, password2, fname, lname, gender, birthday, country, } = req.body;
    // let interest = req.body.interest.toString();
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
            email, username, fname, lname, gender, birthday, country
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
                email, username, fname, lname, gender, birthday, country
            });
        }
        else {
            // Create new user record
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            var role = "STUDENT";
            var status = undefined;
            // Use hashed password
            let user = await User.create({
                email,
                username,
                password: hash,
                fname,
                lname,
                gender,
                country,
                status,
                role
            });
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
    title = "My Profile";
    country = countryList.getData()
    res.render('./user/profile', { title, country });
});

router.post('/updateAccount/:id', (req, res) => {
    let email = req.body.email;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let username = req.body.username;
    let gender = req.body.gender;
    let birthday = moment(req.body.birthday).isValid() ? req.body.birthday : null;
    let country = req.body.country;
    User.update(
        {
            email, fname, lname, username, gender, birthday, country
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' user updated');
            res.redirect('/user/profile/' + req.params.id);
        })
        .catch(err => console.log(err));
});

module.exports = router;