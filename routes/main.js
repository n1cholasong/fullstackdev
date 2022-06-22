const express = require('express');
const Review = require("../models/Review");
const router = express.Router();


router.get('/', (req, res,) => {
	// renders views/index.handlebars, passing title as an object
	res.render('index');
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

module.exports = router;
