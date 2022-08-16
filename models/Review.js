const Seqelize = require('sequelize');
const db = require('../config/DBConfig')
const User = require('./User');
const Courses = require('../models/Courses');


const Review = db.define('review', {
    review: { type: Seqelize.STRING(2000) },
    rating: { type: Seqelize.INTEGER },
    reply: { type: Seqelize.STRING(2000) },
    report: { type: Seqelize.INTEGER },
    reported: { type: Seqelize.INTEGER },
});

Courses.sync();
User.sync();
Review.sync();

reviewsList =
    [
        //review, rating, reply, reportId ,report, userId, CourseId
        {
            review: "Test Case 1", rating: 4, reply: "Basic Python knowdlge", report: 0, reportId: null, userId: 1, CourseId: 1
        },
        {
            review: "Test Case 2", rating: 4, reply: null, report: 0, reportId: null, userId: 1, CourseId: 3
        },
        {
            review: "Test Case 3", rating: 4, reply: "Test Case 3 Reply", report: 0, reportId: null, userId: 1, CourseId: 3
        },
        {
            review: "Test Case 4", rating: 2, reply: "Test Case 4 Reply", report: 0, reportId: null, userId: 1, CourseId: 3
        },
        {
            review: "Test Case 5", rating: 5, reply: "Test Case 5 Reply", report: 0, reportId: null, userId: 1, CourseId: 3
        },
        {
            review: "Test Case 6", rating: 5, reply: null , report: 0, reportId: null, userId: 1, CourseId: 3
        },
        {
            review: "Test Case 7", rating: 1, reply: null , report: 0, reportId: null, userId: 1, CourseId: 3
        },
    ]

    Review.findAndCountAll()
        .then(result => {
            if (result.count < 1) {
                reviewsList.forEach((value) => {
                    Review.create({
                        review: value.review,
                        rating: value.rating,
                        reply: value.reply,
                        report: value.report,
                        reportId: value.reportId,
                        userId: value.userId,  
                        CourseId: value.CourseId,
                    });
                });
            }
        });

    module.exports = Review
