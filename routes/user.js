const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureAuthenticated = require("../helpers/auth");
const moment = require('moment');
const countryList = require('country-list');
// Require for image upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');
// Required for email verification
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');


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

router.get('/verify/:userID/:token', async function (req, res) {
    let id = req.params.userID;
    let token = req.params.token;
    try {
        // Check if user is found
        let user = await User.findByPk(id);
        if (!user) {
            flashMessage(res, 'error', 'User not found');
            res.redirect('/user/login');
            return;
        }
        // Check if user has been verified
        if (user.verified) {
            flashMessage(res, 'info', 'User already verified');
            res.redirect('/user/login');
            return;
        }
        // Verify JWT token sent via URL
        let authData = jwt.verify(token, process.env.APP_SECRET);
        if (authData != user.email) {
            flashMessage(res, 'error', 'Unauthorised Access');
            res.redirect('/user/login');
            return;
        }
        let result = await User.update(
            { verified: 1 },
            { where: { id: user.id } });
        console.log(result[0] + ' user updated');
        flashMessage(res, 'success', user.email + ' verified. Please login');
        res.redirect('/user/login');
    }
    catch (err) {
        console.log(err);
    }
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
            let user = await User.create({
                email,
                verified: 0,
                username,
                password: hash,
                fname,
                lname,
                gender,
                birthday,
                country,
                interest,
                status: undefined,
                role: 'STUDENT',
                active: 1
            });

            // Send email
            let token = jwt.sign(email, process.env.APP_SECRET);
            let url = `${process.env.BASE_URL}:${process.env.PORT}/user/verify/${user.id}/${token}`;
            sendEmail(user.email, url)
                .then(response => {
                    console.log(response);
                    flashMessage(res, 'success', user.email + ' registered successfully', '', 'true');
                    res.redirect('/user/login');
                })
                .catch(err => {
                    console.log(err);
                    flashMessage(res, 'error', 'Error when sending email to ' +
                        user.email, '', 'true');
                    res.redirect('/');
                });
        }
    }
    catch (err) {
        console.log(err);
    }
});

function sendEmail(toEmail, url) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to: toEmail,
        from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: 'Verify Curodemy Account',
        html:
            `
            Thank you registering with Curodemy.<br><br> Please
            <a href=\"${url}"><strong>verify</strong></a> your account.
            `
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

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
        { status },
        { where: { id: req.params.id } }
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
    res.render('./user/passwordUpdate', { title });
});

router.post('/updatePassword/:id', async (req, res) => {
    let { currentPassword, newPassword, newPassword2 } = req.body;
    var salt = bcrypt.genSaltSync(10);

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { id: req.params.id } });
        let isValid = true;

        oldMatch = bcrypt.compareSync(currentPassword, user.password)
        if (oldMatch) {
            if (currentPassword != newPassword) {
                if (newPassword.length >= 6) {
                    if (newPassword == newPassword2) {
                        var hash = bcrypt.hashSync(newPassword, salt);
                        user.update({ password: hash });
                        console.log('Password Updated');
                        flashMessage(res, 'success', 'Password Updated', '', 'true');
                        res.redirect(`../profile/${req.params.id}`);

                    } else { flashMessage(res, 'error', 'Passwords do not match', '', 'true') }
                } else { flashMessage(res, 'error', 'Password must be at least 6 or more characters', '', 'true') }
            } else { flashMessage(res, 'error', 'New password cannot be same as old password', '', 'true') }
        } else { flashMessage(res, 'error', 'Invalid Password', '', 'true') }
    }
    catch (err) {
        console.log(err);
    }

    res.render('./user/passwordUpdate', { title });
});

router.get('/forgotPassword', (req, res) => {
    title = "Forgot Password";
    res.render('./user/passwordForgot', { title });
});

router.get('/resetPassword', (req, res) => {
    title = "Reset Password";
    res.render('./user/passwordReset', { title });
});

module.exports = router;