const express = require('express');
const Review = require("../models/Review");
const router = express.Router();
const flashMessage = require('../helpers/messenger');


router.get('/', (req, res,) => {
	// renders views/index.handlebars, passing title as an object
	res.render('index');
});

router.get('/mycourse', (req, res,) => {
	res.render('mycourse');
});

router.get('/course', (req, res) => {
	Review.findAll({
		raw: true
	})
		.then((reviews) => {
			// pass object to listVideos.handlebar
			res.render('course', { reviews });
		})
		.catch(err => console.log(err));
});

router.post("/createReview", (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;
	// let userId = req.user.id;
	// let userName = req.user.name;

	Review.create(
		{ review, rating }
	)
		.then((review) => {
			console.log(review.toJSON());
			res.redirect('/course');
		})
});

router.get('/deleteReview/:id', async function (req, res) {
	try {
		let review = await Review.findByPk(req.params.id);
		if (!review) {
			flashMessage(res, 'error', 'Review not found');
			res.redirect('/course');
			return;
		}
		// if (req.user.id != review.userId) {
		//     flashMessage(res, 'error', 'Unauthorised access');
		//     res.redirect('/video/listVideos');
		//     return;
		// }

		let result = await Review.destroy({ where: { id: review.id } });
		console.log(result + ' Review deleted');
		res.redirect('/course');
	}
	catch (err) {
		console.log(err);
	}
});


router.post('/editReview/:id', (req, res) => {
	let review = req.body.review.slice(0, 1999);
	let rating = req.body.rating;
	// let userId = req.user.id;
	// let userName = req.user.name;


	Review.update(
		{ review, rating, },
		{ where: { id: req.params.id } }
	)
		.then((result) => {
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

module.exports = router;
