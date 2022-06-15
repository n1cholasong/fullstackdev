const express = require('express');
const router = express.Router();

router.get("/forum", (req, res) => {
    res.render('forum/forumhome')
});

module.exports = router;