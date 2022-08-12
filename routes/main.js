const express = require('express');
const Review = require("../models/Review");
const router = express.Router();
const { ensureAuthenticated, authRole } = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const Course = require('../models/Courses');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const CourseLikes = require('../models/CourseLikes');
userdict = {}
fullname = {}

router.get('/', async function (req, res,) {
	title = "Home";
	// renders views/index.handlebars, passing title as an object
	//find all users and put them into a dict
	await User.findAll({
		raw: true
	}).then((users) => {
		users.forEach(u => {
			userdict[u.id] = u.username
		});
	})


	Course.findAll({
		raw: true
	}).then((Courses) => {
		res.render('index', { Courses, title, userdict });

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
		raw: true
	}).then((users) => {
		users.forEach(u => {
			userdict[u.id] = u.username
			fullname[u.id] = u.fname + ' ' + u.lname
		});
	})

	Review.findAll({
		where: [{ courseId: course.id }, { report: 0 }],
		order: [[ 'createdAt', 'DESC']],
		raw: true
	})
		.then(async (reviews) => {
			var likeStatus
			let course_id = req.params.id;
			try{
				let user_id = req.user.id
				const likeStatus = await CourseLikes.findOne({ where: { courseId: course_id, userId: user_id } })
			}
			catch{
				let user_id = null;
				likeStatus = null;
			};
			const n_likes = await CourseLikes.count({ where: { liked: 1, courseId: course_id } });
			// res.render('forum/comments', { forum, n_likes, likeStatus });

			
			
			// pass object to listVideos.handlebar
			var sum = 0.0;
			var count = 0;
			reviews.forEach((review) => {
				if (review.CourseId == req.params.id) {
					sum += review.rating;
					count++;
				}
			});

			var avg = (sum / count).toFixed(2);
			var roundAvg = Math.floor(avg)

			var print_star = [];
			for (var i = 0; i < roundAvg; i++) {
				print_star.push(i);
			}
			res.render('course', { reviews, course, userdict, fullname, avg, roundAvg, print_star, count, n_likes, likeStatus });
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

	// Send email
	// let token = jwt.sign(req.user.email, process.env.APP_SECRET);
	// let url = `${process.env.BASE_URL}:${process.env.PORT}/user/verify/${req.user.id}/${token}`;

	// sendEmail_Case1(req.user.email)	
	// 	.catch(err => {
	// 		console.log(err);
	// 		flashMessage(res, 'error', 'Error when sending email to ' +
	// 			req.user.email);
	// 		res.redirect('/');
	// 	});

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
			// if (req.user.id == result.userId) {
			// 	flashMessage(res, 'error', 'Unauthorised access');
			// 	res.redirect('back');
			// 	return;
			// }
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
			// if (req.user.id == result.userId) {
			// 	flashMessage(res, 'error', 'Unauthorised access');
			// 	res.redirect('back');
			// 	return;
			// }
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
			// if (req.user.id == result.userId) {
			// 	flashMessage(res, 'error', 'Unauthorised access');
			// 	res.redirect('back');
			// 	return;
			// }
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
	let reported = req.user.id;
	let admin_email = "lucasleejiajin@gmail.com";
	sendEmail_Case1(admin_email)	
		.catch(err => {
			console.log(err);
			flashMessage(res, 'error', 'Error when sending email to ' + req.user.email);
			res.redirect('/');
		});

	await Review.findByPk(req.params.id)
		.then((result) => {
			// if (req.user.id == result.userId) {
			// 	flashMessage(res, 'error', 'Unauthorised access');
			// 	res.redirect('back');
			// 	return;
			// }
			Review.update(
				{ report, reported },
				{ where: { id: req.params.id } }
			)
			// console.log(result[0] + 'Review Reported');
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

router.post("/like/:id", ensureAuthenticated, async function (req, res) {
    let CourseId = req.params.id;
    let userId = req.user.id;
    // let course = await Course.findByPk(courseId);
    let likeStatus = await CourseLikes.findOne({ where: { CourseId: CourseId, userId: userId } });
    // if (course.status == 0) {
    //     flashMessage(res, 'error', 'Forum has been deleted');
    //     res.redirect('/forum/')
    // }

    if (likeStatus == null) {
        CourseLikes.create(
            {
                CourseId, userId
            }
        )
    }
    else if (likeStatus.liked == 1) {
        let liked = 0;
        likeStatus.update({
            liked
        })
    }
    else if (likeStatus.liked == 0) {
        let liked = 1;
        likeStatus.update({
            liked
        })
    }
	res.redirect('back');

    // res.redirect(`/forum/${forumId}`);
});




// To the admin when a review has been reported (To notify that a review has been reported) [To Lucasleejiajin@gmail.com]
function sendEmail_Case1(toEmail) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const message = {
		to: toEmail,
		from: `Curodemy Institute <${process.env.SENDGRID_SENDER_EMAIL}>`,
		subject: 'Review Added in the database',
		html:
			// `
			// Thank you registering with Curodemy.<br><br> Please
			// <a href=\"${url}"><strong>verify</strong></a> your account.
			// `
			`
			A review has been reported, please take action
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