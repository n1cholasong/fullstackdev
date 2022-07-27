const express = require('express');
const Review = require("../models/Review");
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const Course = require('../models/Courses');
const User = require('../models/User')
userdict = {}
fullname = {}

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
			fullname[u.id] = u.fname + ' ' + u.lname
		});
	})

	Review.findAll({
		where : {courseId : course.id},
		raw: true
	})
		.then((reviews) => {
			// pass object to listVideos.handlebar
			res.render('course', { reviews, course ,userdict, fullname});
		})
		.catch(err => console.log(err));
});

router.post("/createReview", ensureAuthenticated, (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;
	let CourseId = req.body.courseId;
	let userId = req.user.id;
	let report = 0;
	// let userName = req.user.username;
	// Review.findAll({
	// 	include : User,
	// 	where : {userId : userId},
	// 	raw: true
	// })
	// .then((result) => {
	// 	console.log(result);
		
	// })

	Review.create(
		{ review, rating, userId, CourseId, report }
	)
		.then((review) => {
			console.log(review.toJSON());
			res.redirect('back');
		})
});

router.get('/deleteReview/:id', ensureAuthenticated, async function (req, res) {
	try {
		let review = await Review.findByPk(req.params.id);
		if (!review) {
			flashMessage(res, 'error', 'Review not found');
			return res.redirect('back');

		}
		if (req.user.id != review.userId) {
			flashMessage(res, 'error', 'Unauthorised access');
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


router.post('/editReview/:id', ensureAuthenticated, async (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('back');
				return;
			}
			Review.update(
				{ review, rating },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Review updated');
			res.redirect('back');
		})
		.catch(err => console.log(err));
});

router.post('/createReply/:id', ensureAuthenticated, async (req, res) => {
	let reply = req.body.review.slice(0, 1999);

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('back');
				return;
			}
			Review.update(
				{ reply },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Reply Created');
			res.redirect('back');
		})
		.catch(err => console.log(err));
});


router.post('/editReply/:id', ensureAuthenticated, async (req, res) => {
	let reply = req.body.review.slice(0, 1999);

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('back');
				return;
			}
			Review.update(
				{ reply },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Reply updated');
			res.redirect('back');
		})
		.catch(err => console.log(err));
});

router.get('/deleteReply/:id', ensureAuthenticated, async (req, res) => {
	// by replacing the value in the database with null will help to reset the reply in the database to a null value which will
	// show as there is no value for reply
	// Using similar to editing way instead of delete is because i dont want to delete it completely as it might affect the review side
	let reply = null;

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('back');
				return;
			}
			Review.update(
				{ reply },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Reply Deleted');
			res.redirect('back');
		})
		.catch(err => console.log(err));
});

router.get('/report/:id', ensureAuthenticated, async (req, res) => {
	// by replacing the value in the database with null will help to reset the reply in the database to a null value which will
	// show as there is no value for reply
	// Using similar to editing way instead of delete is because i dont want to delete it completely as it might affect the review side
	let report = 1;

	await Review.findByPk(req.params.id)
		.then((result) => {
			if (req.user.id != result.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('back');
				return;
			}
			Review.update(
				{ report },
				{ where: { id: req.params.id } }
			)
			console.log(result[0] + 'Reply Deleted');
			res.redirect('back');
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


module.exports = router;