const express = require('express');
const Review = require("../models/Review");
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const Course = require('../models/Courses');
const User = require('../models/User')
userdict = {}

router.get('/', async function(req, res,)  {
	title = "Home";
	// renders views/index.handlebars, passing title as an object
	//find all users and put them into a dict
	await User.findAll({
		raw:true
	}).then((users) =>{
		users.forEach(u => {
			userdict[u.id] = u.username
		});
	})


	Course.findAll({
        raw:true
    }).then((Courses) => {
		res.render('index',{Courses, title,userdict});
		
    })
    .catch(err => console.log(err));
	
});

router.get('/mycourse', (req, res,) => {
	res.render('myCourse');
});

router.get('/course/details/:id', async function (req, res) {
	let course = await Course.findByPk(req.params.id);
	//find all users and put them into a dict
	await User.findAll({
		raw:true
	}).then((users) =>{
		users.forEach(u => {
			userdict[u.id] = u.username
		});
	})

	Review.findAll({
		raw: true
	})
		.then((reviews) => {
			// pass object to listVideos.handlebar
			res.render('course', { reviews,course ,userdict});
		})
		.catch(err => console.log(err));
});

router.post("/createReview", ensureAuthenticated, (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;
	let userId = req.user.id;
	let userName = req.user.username;

	Review.create(
		{ review, rating, userId, userName }
	)
		.then((review) => {
			console.log(review.toJSON());
			res.redirect('/course');
		})
});

router.get('/deleteReview/:id', ensureAuthenticated, async function (req, res) {
	try {
		let review = await Review.findByPk(req.params.id);
		if (!review) {
			flashMessage(res, 'error', 'Review not found');
			return res.redirect('/course');

		}
		if (req.user.id != review.userId) {
			flashMessage(res, 'error', 'Unauthorised access');
			return res.redirect('/course');
		}

		let result = await Review.destroy({ where: { id: review.id } });
		console.log(result + ' Review deleted');
		res.redirect('/course');
	}
	catch (err) {
		console.log(err);
	}
});


router.post('/editReview/:id', ensureAuthenticated, async (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('/course');
				return;
			}
			Review.update(
				{ review, rating },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Review updated');
			res.redirect('/course');
		})
		.catch(err => console.log(err));
});

router.post('/flash', (req, res) => {
	const message = 'This is an important message';
	const error = 'This is an error message';
	const error2 = 'This is the second error message';

	flashMessage(res, 'success', message);
	flashMessage(res, 'info', message);
	flashMessage(res, 'error', error);
	flashMessage(res, 'error', error2, 'fas fa-sign-in-alt', true);
});

router.get('/editReview/:id', ensureAuthenticated, (req, res) => {
	Review.findByPk(req.params.id)
		.then((review) => {
			if (!review) {
				flashMessage(res, 'error', 'Review not found');
				res.redirect('/course');
				return;
			}
			if (req.user.id != review.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('/course');
				return;
			}

			res.render('/editReview', { review });
		})
		.catch(err => console.log(err));
});

module.exports = router;