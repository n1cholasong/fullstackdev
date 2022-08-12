const express = require('express');
const router = express.Router();
const Role = require('../models/Role')
const User = require('../models/User');
const Review = require("../models/Review");
const Course = require('../models/Courses');
const { ensureAuthenticated, authRole } = require("../helpers/auth");

userdict = {}
fullname = {}
useremail = {}


router.all('*', ensureAuthenticated, authRole([1]))

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
                email: 'inactive@curodemy.com',
                password: '',
                gender: '',
                birthday: null,
                country: '',
                interest: null,
                status: null,
                profilePicURL: null,
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
        if (!review) {
            flashMessage(res, 'error', 'Review not found');
            return res.redirect('back');

        }

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
        .then((result) => {
            Review.update(
                { report, reported },
                { where: { id: req.params.id } }
            )
            console.log(result[0] + 'Review Reported');
            res.redirect('back');
        })
        .catch(err => console.log(err));
});

module.exports = router;