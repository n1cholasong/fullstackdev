const express = require('express');
const Review = require("../models/Review");
const router = express.Router();


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

router.get('/deleteReview', async function (req, res) {
    try {
        let video = await Video.findByPk(req.params.id);
        if (!video) {
            flashMessage(res, 'error', 'Video not found');
            res.redirect('/video/listVideos');
            return;
        }
        if (req.user.id != video.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/video/listVideos');
            return;
        }

        let result = await Video.destroy({ where: { id: video.id } });
        console.log(result + ' video deleted');
        res.redirect('/video/listVideos');
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;
