const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require("../models/Review");
const Course = require('../models/Courses');
const ensureAuthenticated = require("../helpers/auth");
userdict = {}
fullname = {}
useremail = {}

router.get('/manageAccounts', (req, res) => {
    title = "Manage Account";
    User.findAll({
        raw: true
    })
        .then((account) => {
            res.render('./admin/accountManagement', { account, title });
        })
        .catch((err) => console.log(err));
});

router.get('/reviewManagement', (req, res) => {
    title = "Review Management";
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
        where: { report : 1 },
        raw: true
    })
        .then((reviews) => {
            res.render('./admin/reviewManagement', { reviews, course, useremail,userdict, title });
        })
        .catch((err) => console.log(err));
});

router.get('/viewAccount/:id', async (req, res) => {
    User.findByPk(req.params.id)
        .then((account) => {
            if (!account) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('./admin/viewAccount');
                return;
            }
            title = `${account.username}'s Profile`;

            res.render('./admin/viewAccount', { account, title });
        })
        .catch(err => console.log(err));

});

router.post('/deleteAccount/:id', ensureAuthenticated, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = await User.destroy({ where: { id: user.id } });
        console.log(result + ' account deleted');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/deleteReview/:id', ensureAuthenticated, async function (req, res) {
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

router.get('/resolve/:id', ensureAuthenticated, async (req, res) => {
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