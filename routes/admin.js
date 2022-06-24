const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureAuthenticated = require("../helpers/auth");

router.get('/manageAccounts', ensureAuthenticated, (req, res) => {
    User.findAll({
        raw: true
    })
        .then((users) => {
            res.render('./admin/accountManagement', { users });
        })
        .catch((err) => console.log(err));
});

module.exports = router;