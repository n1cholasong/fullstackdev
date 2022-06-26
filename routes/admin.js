const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureAuthenticated = require("../helpers/auth");

router.get('/manageAccounts', (req, res) => {
    User.findAll({
        raw: true
    })
        .then((account) => {
            res.render('./admin/accountManagement', { account });
        })
        .catch((err) => console.log(err));
});

router.post('/deleteAccount/:id', ensureAuthenticated,  async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = await User.destroy({ where: { id: user.id } });
        console.log(result + ' account deleted');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;