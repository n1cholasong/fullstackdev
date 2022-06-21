const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
require('dotenv').config;

router.get("/", (req, res) => {
    Forum.findAll({
        raw: true
    })
        .then((thread) => {
            res.render('forum/forumhome', { thread });
        })
        .catch(err => console.log(err));

});

router.post("/createThread", (req, res) => {
    let topic = req.body.topic;
    let description = req.body.thread_description;

    Forum.create(
        {
            topic, description
        }
    )

    res.redirect('/forum/')
})

module.exports = router;