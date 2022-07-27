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
    let { email, username, password, password2, fname, lname, gender, birthday, country } = req.body;

    // let interest = req.body.interest.toString();
    let isValid = true;

    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters', '', 'true');
        isValid = false;
    }

    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match', '', 'true');
        isValid = false;
    }

    if (!isValid) {
        res.render('user/signup', {
            email,
            username,
            fname,
            lname,
            gender,
            birthday,
            country
        });
        return;
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' alreay registered', '', 'true');
            res.render('user/signup', {
                email, username, fname, lname, gender, birthday, country,
            });
        } else {
            // Create new user record
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            let birthday = moment(req.body.birthday).isValid() ? req.body.birthday : null;
            let interest = req.body.interest === undefined ? "" : req.body.interest.toString();
            let role = "STUDENT";
            let status = undefined;
            // Use hashed password
            await User.create({
                email,
                username,
                password: hash,
                fname,
                lname,
                gender,
                birthday,
                country,
                interest,
                status,
                role
            });
            flashMessage(res, 'success', email + ' registered successfully', '', 'true');
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

router.get('/profile/:id', (req, res) => {
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
        .catch(err =>
            console.log(err)
        );
});

router.post('/updateStatus/:id', (req, res) => {
    let status = req.body.status;

    User.update(
        { status }, { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' status updated');
            res.redirect('/user/profile/' + req.params.id);
        })
        .catch(err =>
            console.log(err)
        );
});

router.get('/updatePassword/:id', (req, res) => {
    title = "Update Password";
    res.render('./user/updatePassword', { title });
});

router.post('/updatePassword/:id', async (req, res) => {
    let { currentPassword, newPassword, newPassword2 } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(currentPassword, salt);

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { id: req.params.id } });
        
        isMatch = bcrypt.compareSync(currentPassword, user.password)
        if (!isMatch) {
            flashMessage(res, 'error', 'Invalid Password', '', 'true');
        }
        // if (user.password = currentPassword) {
        //     // If user is found, that means email has already been registered
        //     flashMessage(res, 'error', 'Incorrect password');
        //     res.render('./user/updatePassword');
        // } else {
        //     // Create new user record
        //     var salt = bcrypt.genSaltSync(10);
        //     var hash = bcrypt.hashSync(password, salt);
        // }
    }
    catch (err) {
        console.log(err);
    }

    
    // if currentPassword !=


    res.render('./user/updatePassword', { title });
});


module.exports = router;