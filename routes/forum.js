const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const getLikeCount = require('../helpers/forumLikes')
const Forum = require('../models/Forum');
const User = require('../models/User');
const Comment = require('../models/Comments');
const ForumLikes = require('../models/ForumLikes');
const ForumFav = require('../models/ForumFavourites')
const { ensureAuthenticated, authRole } = require("../helpers/auth");
require('dotenv').config;
// Required for file upload
const fs = require('fs');
const upload = require('../helpers/forumUpload');


router.get("/", (req, res) => {
    Forum.findAll({
        where: { status: 1 },
        include: [User, ForumLikes, ForumFav]
    })
        .then(async (thread) => {
            //To count likes
            var likes_dict = [];
            for (i in thread) {
                let forum_id = thread[i].id;
                const n_likes = await ForumLikes.count({ where: { liked: 1, forumId: forum_id } });
                likes_dict.push({'forumId' : forum_id, 'n_likes' : n_likes});
            }


            res.render('forum/forumhome', { thread, likes_dict });
        })
        .catch(err => console.log(err));

});

router.get("/mythreads", ensureAuthenticated, (req, res) => {
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

router.post("/createThread", ensureAuthenticated, (req, res) => {
    let topic = req.body.topic;
    let description = req.body.thread_description;
    let userId = req.user.id;
    let pictureURL = req.body.pictureURL;
    let status = 1;

    Forum.create(
        {
            topic, description, pictureURL, status, userId
        }
    )

    res.redirect('/forum/')
});

router.post('/editThread/:id', ensureAuthenticated, async function (req, res) {
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

router.post('/deleteThread/:id', ensureAuthenticated, async function (req, res) {
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
router.get('/:id', ensureAuthenticated, (req, res) => {
    Forum.findOne({
        where: { id: req.params.id },
        include: [Comment, ForumLikes]
    }).then(async (forum) => {
        let forum_id = req.params.id;
        let user_id = req.user.id;
        if (user_id) {
            const n_likes = await ForumLikes.count({ where: { liked: 1, forumId: forum_id } });
            const likeStatus = await ForumLikes.findOne({ where: { forumId: forum_id, userId: user_id } })
            res.render('forum/comments', { forum, n_likes, likeStatus });
        }
        else {
            let likeStatus = 0;
            const n_likes = await ForumLikes.count({ where: { liked: 1, forumId: forum_id } });
            res.render('forum/comments', { forum, n_likes, likeStatus });
        }
    }).catch((err) => {
        console.log('err', err);
    });
});

router.post("/comment", ensureAuthenticated, async function (req, res) {
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

//Like bullshit
router.post("/like/:id", ensureAuthenticated, async function (req, res) {
    let forumId = req.params.id;
    let userId = req.user.id;

    let forum = await Forum.findByPk(forumId);
    let likeStatus = await ForumLikes.findOne({ where: { forumId: forumId, userId: userId } });
    if (forum.status == 0) {
        flashMessage(res, 'error', 'Forum has been deleted');
        res.redirect('/forum/')
    }
    if (likeStatus == null) {
        ForumLikes.create(
            {
                forumId, userId
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

    res.redirect(`/forum/${forumId}`);
});

router.post("/addFav/:id", ensureAuthenticated, async function (req, res) {
    let forumId = req.params.id;
    let userId = req.user.id;

    //Check if forum exist
    let forum = await Forum.findByPk(forumId);

    //Check if it is already added as favourites
    let favStatus = await ForumFav.findOne({ where: { forumId: forumId, userId: userId } });

    //If forum is deleted
    if (forum.status == 0) {
        flashMessage(res, 'error', 'Forum has been deleted');
        res.redirect('/forum/')
    }
    let topic = forum.topic
    //If an instance does not exist
    if (favStatus == null) {
        ForumFav.create(
            {
                topic, forumId, userId
            }
        )
    }

    //If already added to favourits
    else if (favStatus.favourite == 1) {
        let favourite = 0;
        //Remove from favourites
        favStatus.update({
            favourite: favourite
        })
    }

    //If removed from favourites
    else if (favStatus.favourite == 0) {
        let favourite = 1;
        //Add back to favourites
        favStatus.update({
            favourite: favourite
        })
    }

    res.redirect(`/forum/`);
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