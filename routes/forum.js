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
});

router.post('/editThread/:id', (req, res) => {
    let topic = req.body.topic;
    let description = req.body.thread_description;

    Forum.update(
        {
            topic, description
        },
        {where: {id: req.params.id}}
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

module.exports = router;