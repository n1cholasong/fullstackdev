const express = require('express');
const router = express.Router();

const flashMessage = require('../helpers/messenger');

const Role = require('../models/Role');
const User = require('../models/User');
const Subject = require('../models/Subject');

// Passport Authentication
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, authUser, authActive, authValid } = require("../helpers/auth");

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
    let title = "Log in";
    res.render('./user/login', { title });
})


router.post('/login', passport.authenticate('local', {
    // Success redirect URL
    // successRedirect: '/',
    // Failure redirect URL
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    User.update({ logonAt: Date.now() }, { where: { id: req.user.id } })
    if (req.user.active == 0) {
        res.redirect('/user/deactivated');
    } else {
        res.redirect('/');
    }
});

router.get('/verify/:id/:token', async function (req, res) {
    let id = req.params.id;
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
            flashMessage(res, 'info', 'Account already verified');
            if (req.user) {
                res.redirect('/user/profile/' + id);
            } else {
                res.redirect('/user/login');
            }
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
        flashMessage(res, 'success', user.email + ' is verified. Please login');
        if (req.user) {
            res.redirect('/user/profile/' + id);
        } else {
            res.redirect('/user/login');
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/signup', async (req, res) => {
    let title = "Sign Up";
    let country = countryList.getData();
    let category = await Subject.findAll(
        {
            where: { active: 1 },
            raw: true
        }
    );
    res.render('./user/signup', { title, country, category });

})

router.post('/signup', async function (req, res) {
    let { email, username, password, password2, fname, lname, gender, birthday, country } = req.body;
    let category = await Subject.findAll(
        {
            where: { active: 1 },
            raw: true
        }
    );

    let isValid = true;
    let re = /\S+@\S+\.\S+/;
    let validEmail = re.test(email);

    if (!validEmail) {
        flashMessage(res, 'error', 'Invalid Email Address', '', 'true');
        isValid = false;
    }

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
            country,
            category
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
                email, username, fname, lname, gender, birthday, country, category
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
                active: 1,
                roleId: 2 // Student
            });

            // Send email
            let token = jwt.sign(email, process.env.APP_SECRET);
            let url = `${process.env.BASE_URL}:${process.env.PORT}/user/verify/${user.id}/${token}`;
            let topic = "Verify Curodemy Account";
            let message =
                `
                Hi ${user.fname}, 
                <br>
                <br>
                Thank you for registering with Curodemy!              
                `
            let verb = "verify"
            sendEmail(user.email, url, topic, message, verb)
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

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

router.get('/profile/:id', ensureAuthenticated, authUser, authActive, async (req, res) => {
    let title = "My Profile";
    let country = countryList.getData();
    let user = await User.findByPk(req.params.id, { include: Role });
    res.render('./user/profile', { title, country, user });
});

// router.get('/profileView/:id', authActive, async (req, res) => {
//     let title = "My Profile"
//     let country = countryList.getData();
//     let user = await User.findByPk(req.params.id, { include: Role });
//     res.render('./user/profile', { title, country, user });
// });

router.post('/updateAccount/:id', ensureAuthenticated, authUser, authActive, async (req, res) => {
    let email = req.body.email;
    let re = /\S+@\S+\.\S+/;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let username = req.body.username;
    let gender = req.body.gender;
    let birthday = moment(req.body.birthday).isValid() ? req.body.birthday : null;
    let country = req.body.country;

    let user = await User.findByPk(req.params.id);

    try {
        // Check for valid email
        if (re.test(email)) {
            // Check if body email match with DB 
            if (email == user.email) {
                User.update(
                    {
                        fname, lname, username, gender, birthday, country
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
            } else {
                let otherUser = await User.findOne({ where: { email: email } })
                // Check if body email exists in DB
                if (!otherUser) {
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
                } else {
                    flashMessage(res, 'error', 'Email is taken', '', 'true');
                    res.redirect('back');
                }
            }
        } else {
            flashMessage(res, 'error', 'Invalid Email', '', 'true');
            res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/updateStatus/:id', ensureAuthenticated, authUser, authActive, (req, res) => {
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

router.get('/updatePassword/:id', ensureAuthenticated, authUser, authActive, (req, res) => {
    let title = "Update Password";
    res.render('./user/passwordUpdate', { title });
});

router.post('/updatePassword/:id', ensureAuthenticated, authUser, authActive, async (req, res) => {
    let title = "Update Password";
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
    let title = "Forgot Password";
    res.render('./user/passwordForgot', { title });
});

router.post('/forgotPassword', async (req, res) => {
    let email = req.body.email;
    let user = await User.findOne({ where: { email: email } })

    if (user) {
        let token = jwt.sign(email, process.env.APP_SECRET);
        // different link
        let url = `${process.env.BASE_URL}:${process.env.PORT}/user/resetPassword/${user.id}/${token}`;
        let topic = "Curodemy Password Reset";
        let message =
            `
            Hi ${user.fname}, 
            <br>
            <br>
            Someone has requested a password reset for you Curodemy account ${email}.             
            `
        let verb = "reset"
        sendEmail(user.email, url, topic, message, verb)
            .then(response => {
                console.log(response);
                flashMessage(res, 'success', 'A password reset link has been sent to your email', '', 'true');
                res.redirect('/user/login/');
            })
            .catch(err => {
                console.log(err);
                flashMessage(res, 'error', 'Error when sending email to ' +
                    user.email, '', 'true');
                res.redirect('/user/login');
            });
    } else {
        flashMessage(res, 'error', 'There is no account with that email ', '', 'true');
        res.redirect('/user/forgotPassword');
    }
});

router.get('/resetPassword/:id/:token', (req, res) => {
    let title = "Reset Password";
    let id = req.params.id;
    let token = req.params.token;
    res.render('./user/passwordReset', { title, id, token })
})

router.post('/resetPassword/:id/:token', async (req, res) => {
    let id = req.params.id;
    let token = req.params.token;
    try {
        // Check if user is found
        let user = await User.findByPk(id);
        if (!user) {
            flashMessage(res, 'error', 'User not found');
            res.redirect('/user/login');
            return;
        }
        // Verify JWT token sent via URL
        let authData = jwt.verify(token, process.env.APP_SECRET);
        if (authData != user.email) {
            flashMessage(res, 'error', 'Unauthorised Access');
            res.redirect('/user/login');
            return;
        } else {
            let newPassword = req.body.newPassword;
            let newPassword2 = req.body.newPassword2;
            var salt = bcrypt.genSaltSync(10);

            try {
                // If all is well, checks if user is already registered
                let user = await User.findByPk(req.params.id);

                oldMatch = bcrypt.compareSync(newPassword, user.password)
                if (!oldMatch) {
                    if (newPassword.length >= 6) {
                        if (newPassword == newPassword2) {
                            var hash = bcrypt.hashSync(newPassword, salt);
                            user.update({ password: hash });
                            console.log('Password Updated');
                            flashMessage(res, 'success', 'Password Updated', '', 'true');
                            res.redirect('/user/login');

                        } else {
                            flashMessage(res, 'error', 'Passwords do not match', '', 'true')
                            res.redirect(`/user/resetPassword/${id}/${token}`);
                        }
                    } else {
                        flashMessage(res, 'error', 'Password must be at least 6 or more characters', '', 'true')
                        res.redirect(`/user/resetPassword/${id}/${token}`);
                    }
                } else {
                    flashMessage(res, 'error', 'New password cannot be same as old password', '', 'true')
                    res.redirect(`/user/resetPassword/${id}/${token}`);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/uploadProfilePic', ensureAuthenticated, authActive, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, { recursive: true });
        console.log("Upload File Created")
    }

    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            res.json({
                file: `/uploads/${req.user.id}/${req.file.filename}`
            });
        }
    });
});

router.post('/updateProfilePic/:id', ensureAuthenticated, authUser, authActive, (req, res) => {
    let profilePicURL = req.body.profilePicURL;
    User.update(
        { profilePicURL },
        { where: { id: req.params.id } }
    )
        .then(
            res.redirect('/user/profile/' + req.user.id)
        )
        .catch(err =>
            console.log(err)
        );
});

router.get('/resetProfilePic/:id', ensureAuthenticated, authUser, authActive, (req, res) => {
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

router.get('/resendVerification/:id', ensureAuthenticated, authUser, authActive, authValid, (req, res) => {
    let title = "Resend Verification";
    res.render('./user/resendVerification', { title });
});

router.post('/resendVerification/:id', ensureAuthenticated, authUser, authActive, authValid, async (req, res) => {
    let email = req.body.email;
    let user = await User.findByPk(req.user.id);

    if (user.email == email) {
        let token = jwt.sign(email, process.env.APP_SECRET);
        // different link
        let url = `${process.env.BASE_URL}:${process.env.PORT}/user/verify/${user.id}/${token}`;
        let topic = "Verify Curodemy Account";
        let message =
            `
            Hi ${user.fname}, 
            <br>
            <br>
            Thank you for registering with Curodemy!              
            `
        let verb = "verify"
        sendEmail(user.email, url, topic, message, verb)
            .then(response => {
                console.log(response);
                flashMessage(res, 'success', 'A verification link has been sent to your email', '', 'true');
                res.redirect('/user/profile/' + req.params.id);
            })
            .catch(err => {
                console.log(err);
                flashMessage(res, 'error', 'Error when sending email to ' +
                    user.email, '', 'true');
                res.redirect('/');
            });
    } else {
        flashMessage(res, 'error', 'Email do not match with registered address', '', 'true');
        res.redirect('back');
    }
});

router.get('/deactivated', ensureAuthenticated, (req, res) => {
    let title = "Account Deactivated"
    res.render('./user/deactivated', { title })
});

router.post('/deactivateAccount/:id', ensureAuthenticated, authUser, (req, res) => {
    let title = "Account Deactivated"
    User.update({ active: 0 }, { where: { id: req.user.id } })
    res.render('./user/deactivated', { title })
});

router.get('/reactivate/:id/:token', async function (req, res) {
    let id = req.params.id;
    let token = req.params.token;
    try {
        // Check if user is found
        let user = await User.findByPk(id);
        if (!user) {
            flashMessage(res, 'error', 'User not found', '', 'true');
            if (req.user) {
                res.redirect('/user/profile/' + id);
            } else {
                res.redirect('/user/login');
            }
            return;
        }
        // Check if user has been re-activated
        if (user.active) {
            flashMessage(res, 'info', 'Account already activated', '', 'true');
            if (req.user) {
                res.redirect('/user/profile/' + id);
            } else {
                res.redirect('/user/login');
            }
            return;
        }
        // Verify JWT token sent via URL
        let authData = jwt.verify(token, process.env.APP_SECRET);
        if (authData != user.email) {
            flashMessage(res, 'error', 'Unauthorised Access', '', 'true');
            if (req.user) {
                res.redirect('/user/profile/' + id);
            } else {
                res.redirect('/user/login');
            }
            return;
        }
        let result = await User.update(
            { active: 1 },
            { where: { id: user.id } });
        console.log(result[0] + ' user updated');
        flashMessage(res, 'success', 'Account is re-activated.', '', 'true');
        if (req.user) {
            res.redirect('/user/profile/' + id);
        } else {
            res.redirect('/user/login');
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/reactivateAccount/:id', ensureAuthenticated, authUser, async (req, res) => {
    let user = await User.findByPk(req.user.id);
    let token = jwt.sign(user.email, process.env.APP_SECRET);
    let url = `${process.env.BASE_URL}:${process.env.PORT}/user/reactivate/${user.id}/${token}`;
    let topic = "Re-activate Curodemy Account";
    let message =
        `
                Hello ${user.fname}, 
                <br>
                <br>
                We are delighted to welcome you back to the Curodemy family!            
                `
    let verb = "reactivate"
    sendEmail(user.email, url, topic, message, verb)
        .then(response => {
            console.log(response);
            flashMessage(res, 'success', 'A re-activation link has been sent to your email', '', 'true');
            if (req.user) {
                res.redirect('/user/deactivated/');
            } else {
                res.redirect('/user/login');
            }
        })
        .catch(err => {
            console.log(err);
            flashMessage(res, 'error', 'Error when sending email to ' +
                user.email, '', 'true');
            res.redirect('/');
        });
});

function sendEmail(toEmail, url, topic, intro, verb) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to: toEmail,
        from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: topic,
        html:
            `
            ${intro}
            <br>
            Click <a href=\"${url}"><strong>here</strong></a> to ${verb} your account.
            <br>
            <br>
            If you did not make this request simply ignore this email. Only a person with access to you email can take action.
            <br>
            <br>
            Regards,
            <br>
            The Curodemy Team
            `
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

module.exports = router;