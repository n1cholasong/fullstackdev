const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureAuthenticated = require("../helpers/auth");
const moment = require('moment');
const countryList = require('country-list');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


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
            let active = 1;
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
                role,
                active
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
    User.update(
        { status: req.body.status },
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
        let user = await User.findByPk(req.params.id);
        // let isValid = true;

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

router.post('/uploadProfilePic', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/user.svg', err: err });
        }
        else {
            res.json({
                file: `/uploads/${req.user.id}/${req.file.filename}`
            });
        }
    });
});

router.post('/updateProfilePic/:id', (req, res) => {
    let profilePicURL = req.body.profilePicURL;

    User.update(
        { profilePicURL },
        { where: { id: req.params.id } }
    )
        .then(
            res.redirect('/user/profile/' + req.params.id)
        )
        .catch(err =>
            console.log(err)
        );
    res.render('./user/profile');
});

router.get('/resetProfilePic/:id', (req, res) => {
    User.update(
        { profilePicURL: null },
        { where: { id: req.params.id } }
    )
        .then(
            res.redirect('/user/profile/' + req.params.id)
        )
        .catch(err =>
            console.log(err)
        );

});


module.exports = router;