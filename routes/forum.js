const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Forum = require('../models/Forum');
const User = require('../models/User');
const Comment = require('../models/Comments');
require('dotenv').config;
// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');

router.get("/", (req, res) => {
    Forum.findAll({
        include: User,
        raw: true,
        where: { status: 1 }
    })
        .then((thread) => {
            // if (thread.userId == User.id) {
            //     editable = true
            // }
            // else{
            //     editable = false
            // }

            res.render('forum/forumhome', { thread });
        })
        .catch(err => console.log(err));

});

router.get("/mythreads", (req, res) => {
    Forum.findAll({
        include: User,
        raw: true,
        where: { status: 1, userId: req.user.id }
    })
        .then((thread) => {
            // if (thread.userId == User.id) {
            //     editable = true
            // }
            // else{
            //     editable = false
            // }

            res.render('forum/forumhome', { thread });
        })
        .catch(err => console.log(err));

});

router.post("/createThread", (req, res) => {
    let topic = req.body.topic;
    let description = req.body.thread_description;
    let userId = req.user.id;
    let pictureURL = req.body.pictureURL;
    let status = 1;
    let likes = 0;

    Forum.create(
        {
            topic, description, pictureURL, status, likes, userId
        }
    )

    res.redirect('/forum/')
});

router.post('/editThread/:id', async function (req, res) {
    let forum = await Forum.findByPk(req.params.id);

    let topic = req.body.topic;
    let description = req.body.thread_description;
    let userId = req.user.id;
    let pictureURL = req.body.pictureURL;
    if (!forum) {
        flashMessage(res, 'error', 'This is not a forum.');
        res.redirect('/forum/');
        return;
    }
    if (req.user.id != forum.userId) {
        flashMessage(res, 'error', 'This is not your forum.');
        res.redirect('/forum/');
        return;
    }
    Forum.update(
        {
            topic, description, pictureURL, userId
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' thread updated');
            flashMessage(res, 'success', 'Forum' + forum.topic + 'updated');
            res.redirect('/forum/');
        })
        .catch(err => console.log(err));
});

router.post('/deleteThread/:id', async function (req, res) {
    try {
        let forum = await Forum.findByPk(req.params.id);
        let status = 0;
        if (!forum) {
            flashMessage(res, 'error', 'This is not a forum.');
            res.redirect('/forum/');
            return;
        }
        if (req.user.id != forum.userId) {
            flashMessage(res, 'error', 'This is not your forum.');
            res.redirect('/forum/');
            return;
        }
        let result = await Forum.update({
            status
        },
            ({ where: { id: forum.id } }));
        console.log(result + ' thread deleted');
        res.redirect('/forum/');
    }
    catch (err) {
        console.log(err);
    }
});

//Comments bullshit
router.get('/:id', (req, res) => {
    Forum.findOne({
        where: { id: req.params.id },
        include: Comment
    })
        .then((forum) => {
            res.render('forum/comments', { forum });
        })
        .catch(err => console.log(err));
});

router.post("/comment", (req, res) => {
    let comment = req.body.comment;
    let forumId = req.body.forum_id;
    let userId = req.user.id;

    Comment.create(
        {
            comment, forumId, userId
        }
    )
    
    res.redirect(`/forum/${forumId}`);
});

router.post('/upload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            res.json({
                file: `/uploads/${req.user.id}/${req.file.filename}`
            });
        }
    });
});

module.exports = router;