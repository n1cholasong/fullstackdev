const express = require('express');
const router = express.Router();
const Role = require('../models/Role')
const User = require('../models/User');
const Review = require("../models/Review");
const Course = require('../models/Courses');
const Subject = require('../models/Subject');
const flashMessage = require('../helpers/messenger');
const { ensureAuthenticated, authRole, authActive } = require("../helpers/auth");
const sgMail = require('@sendgrid/mail');


userdict = {}
fullname = {}
useremail = {}


router.all('*', ensureAuthenticated, authRole([1]), authActive)

router.get('/manageAccounts', async (req, res) => {
    let title = "Manage Account";
    await User.findAll({
        include: Role
    })
        .then((account) => {
            res.render('./admin/accountManagement', { account, title });
        })
        .catch((err) =>
            console.log(err)
        );
});

router.get('/manageCategory', async (req, res) => {
    let title = "Manage Category";
    await Subject.findAll({
        raw: true
    })
        .then((categories) => {
            res.render('./admin/categoryManagement', { categories, title });
        })
        .catch((err) =>
            console.log(err)
        );
});

router.post('/manageCategory/create', (req, res) => {
    let title = req.body.title;
    let description = req.body.desc;
    Subject.create({ title: title, description: description })
        .then(() => {
            flashMessage(res, 'success', 'New category created', '', 'true');
            res.redirect('/admin/manageCategory');
        })
        .catch((err) =>
            console.log(err)
        );
});

router.post('/manageCategory/deactivate/:id', async (req, res) => {
    let subject = await Subject.findByPk(req.params.id)

    subject.update({ active: 0 }, { where: { id: req.params.id } })
        .then((result) => {
            console.log(result + ' category deactivated');
            flashMessage(res, 'error', subject.title + ' is Offline', '', 'true');
            res.redirect('/admin/manageCategory');

        })
        .catch((err) =>
            console.log(err)
        );
});

router.get('/manageCategory/activate/:id', async (req, res) => {
    let subject = await Subject.findByPk(req.params.id)

    subject.update({ active: 1 }, { where: { id: req.params.id } })
        .then((result) => {
            console.log(result + ' category activated');
            flashMessage(res, 'success', subject.title + ' is Online', '', 'true');
            res.redirect('/admin/manageCategory');

        })
        .catch((err) =>
            console.log(err)
        );
});

router.get('/viewAccount/:id', async (req, res) => {
    User.findByPk(req.params.id, { include: Role })
        .then((account) => {
            if (!account) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('./admin/viewAccount');
                return;
            }
            let title = `${account.username}'s Profile`;

            res.render('./admin/viewAccount', { account, title });
        })
        .catch((err) =>
            console.log(err)
        );

});

router.post('/deleteAccount/:id', async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = await user.destroy({ id: user.id });
        console.log(result + ' account deleted');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/deactivateAccount/:id', async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = user.update(
            {
                active: 0
            });
        console.log(result + ' account deactivated');
        res.redirect('back');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/activateAccount/:id', async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = user.update({ active: 1 });
        console.log(result + ' account activated');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/reviewManagement', (req, res) => {
    let title = "Review Management";
    let course = Course.findByPk(req.params.id);
    User.findAll({
        raw: true
    }).then((users) => {
        users.forEach(u => {
            userdict[u.id] = u.username
            useremail[u.id] = u.email
            fullname[u.id] = u.fname + ' ' + u.lname
        });
    })
    Review.findAll({
        where: { report: 1 },
        raw: true
    })
        .then((reviews) => {
            res.render('./admin/reviewManagement', { reviews, course, useremail, userdict, title });
        })
        .catch((err) =>
            console.log(err)
        );
});


// LUCAS ADMIN REVIEW ROUTES ============================================================
router.get('/deleteReview/:id', async function (req, res) {
    try {
        let review = await Review.findByPk(req.params.id);
        // Case 1: Check if review is still there
        if (!review) {
            flashMessage(res, 'error', 'Review not found');
            return res.redirect('back');
        }
        if (review.report != 1) {
            flashMessage(res, 'error', 'Action has already been taken. Report Not Found');
            return res.redirect('back');
        }
        await Review.findByPk(req.params.id)
            .then(async (result) => {
                var reportedEmail = await User.findByPk(result.reported).then((user) => { return user.email });
                sendEmail_Case3(reportedEmail)
                    .catch(err => {
                        console.log(err);
                        flashMessage(res, 'error', 'Error when sending email to ' +
                            req.user.email);
                        res.redirect('/');
                    });
                var reviewreport = await User.findByPk(result.userId).then((user) => { return user.email });
                sendEmail_Case4(reviewreport)
                    .catch(err => {
                        console.log(err);
                        flashMessage(res, 'error', 'Error when sending email to ' +
                            req.user.email);
                        res.redirect('/');
                    });
            })
        let result = await Review.destroy({ where: { id: review.id } });
        console.log(result + ' Review deleted');
        res.redirect('back');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/resolve/:id', async (req, res) => {
    // by replacing the value in the database with null will help to reset the reply in the database to a null value which will
    // show as there is no value for reply
    // Using similar to editing way instead of delete is because i dont want to delete it completely as it might affect the review side
    let report = 0;
    let reported = null;

    await Review.findByPk(req.params.id)
        .then(async (result) => {
            // Case 1: Check if review is still there
            if (!result) {
                flashMessage(res, 'error', 'Review not found');
                return res.redirect('back');
            }
            if (result.report != 1) {
                flashMessage(res, 'error', 'Action has already been taken. Report Not Found');
                return res.redirect('back');
            }
            var reportedEmail = await User.findByPk(result.reported).then((user) => { return user.email });
            sendEmail_Case2(reportedEmail)
                .catch(err => {
                    console.log(err);
                    flashMessage(res, 'error', 'Error when sending email to ' +
                        req.user.email);
                    res.redirect('/');
                });
            Review.update(
                { report, reported },
                { where: { id: req.params.id } }
            )
            // console.log(result[0] + 'Review Reported');
            res.redirect('back');
        })
        .catch(err => console.log(err));
});

function sendEmail_Case2(toEmail) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to: toEmail,
        from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: 'Review Report',
        html:
            // `
            // Thank you registering with Curodemy.<br><br> Please
            // <a href=\"${url}"><strong>verify</strong></a> your account.
            // `
            `
			Action Taken: Report Review Unsuccessfully
			`
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

function sendEmail_Case3(toEmail) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to: toEmail,
        from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: 'Review Report',
        html:
            // `
            // Thank you registering with Curodemy.<br><br> Please
            // <a href=\"${url}"><strong>verify</strong></a> your account.
            // `
            `
			Action Taken: Report Review Successfully
			`
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

function sendEmail_Case4(toEmail) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to: toEmail,
        from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: 'Review Report',
        html:
            // `
            // Thank you registering with Curodemy.<br><br> Please
            // <a href=\"${url}"><strong>verify</strong></a> your account.
            // `
            `
            Your Review Has Been Report & Actions Have Been Taken. Your Review Has Been Deleted.
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