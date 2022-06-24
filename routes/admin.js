const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureAuthenticated = require("../helpers/auth");

router.get('/manageAccounts', (req, res) => {
    User.findAll({
        raw: true
    })
        .then((users) => {
            res.render('./admin/accountManagement', { users });
        })
        .catch((err) => console.log(err));
});

router.post('/deleteAccount/:id', ensureAuthenticated, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../user/manageAccounts/');
            return;
        }

        let result = await User.destroy({ where: { id: user.id } });
        console.log(result + ' account deleted');
        res.redirect('../../user/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;