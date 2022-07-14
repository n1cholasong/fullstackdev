const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
const User = require('../models/User');
require('dotenv').config;
// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');

router.get("/", (req, res) => {
    Forum.findAll({
        include: User,
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
    let userId = req.user.id;
    let pictureURL = req.body.pictureURL;

    Forum.create(
        {
            topic, description, pictureURL, userId
        }
    )

    res.redirect('/forum/')
});

router.post('/editThread/:id', (req, res) => {
    let topic = req.body.topic;
    let description = req.body.thread_description;
    let userId = req.user.id;
    let pictureURL = req.body.pictureURL;

    Forum.update(
        {
            topic, description, pictureURL, userId
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' thread updated');
            res.redirect('/forum/');
        })
        .catch(err => console.log(err));
});

router.post('/deleteThread/:id', async function (req, res) {
    try {
        let forum = await Forum.findByPk(req.params.id);
        if (!forum) {
            res.redirect('/forum/');
            return;
        }
        // if (req.user.id != forum.userId) {
        //     res.redirect('/forum/');
        //     return;
        // }
        let result = await Forum.destroy({ where: { id: forum.id } });
        console.log(result + ' thread deleted');
        res.redirect('/forum/');
    }
    catch (err) {
        console.log(err);
    }
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