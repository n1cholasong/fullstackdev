const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureAuthenticated = require("../helpers/auth");

router.get('/manageAccounts', (req, res) => {
    title = "Manage Account";
    User.findAll({
        raw: true
    })
        .then((account) => {
            res.render('./admin/accountManagement', { account, title });
        })
        .catch((err) => console.log(err));
});

router.get('/viewAccount/:id', async (req, res) => {
    User.findByPk(req.params.id)
        .then((account) => {
            if (!account) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('./admin/viewAccount');
                return;
            }
            title = `${account.username}'s Profile`;

            res.render('./admin/viewAccount', { account, title });
        })
        .catch(err => console.log(err));

});

router.post('/deleteAccount/:id', ensureAuthenticated, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = await user.destroy({ id: user.id });
        console.log(result + ' account deleted');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/deactivateAccount/:id', ensureAuthenticated, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = user.update(
            {
                email: 'inactive@curodemy.com',
                gender: '',
                birthday: null,
                country: '', 
                interest: null,
                status: null,
                active: 0
            });
        console.log(result + ' account deactivated');
        res.render('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/activateAccount/:id', ensureAuthenticated, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
            res.redirect('../../admin/manageAccounts/');
            return;
        }

        let result = user.update({ active: 1 });
        console.log(result + ' account activated');
        res.redirect('../../admin/manageAccounts/');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;