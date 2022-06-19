const express = require('express');
const router = express.Router();

router.get("/forum", (req, res) => {
    res.render('forum/forumhome')
});

router.post("/createThread", (req, res) =>{
    let topic = req.body.topic;
    let description = req.body.description;

    res.redirect('/forum/forum')
})

module.exports = router;