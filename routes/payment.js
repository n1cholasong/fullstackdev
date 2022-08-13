const express = require('express');
const { ServerResponse } = require('http');
const router = express.Router();
var paypal = require('paypal-rest-sdk');
const Voucher = require('../models/Voucher')
const clientId = "AfJDDolo98rPYD9uMtSOurkdgDEJc5w1StGG4Jl93u2NIbjPOpT1hKWlgmPyIyppDcxZgpeNNMXqMD-e";
const secret = "EGCtIt8hg_gwS3YXKUP77wcZB1Fj7EmBv4ifuPGHeQSFwFZ8zk870-mHiCO77c-xz2Q_UaIiYNuTcml7";




router.get('/', (req, res) => {
    // renders views/index.handlebars, passing title as an object
    res.render('./payment/payment')
});

router.get('/createVoucher', (req, res) => {
    // renders views/index.handlebars, passing title as an object
    res.render('./payment/createVoucher')
});

router.get('/Vouchers', (req, res) => {
    // renders views/index.handlebars, passing title as an object
    Voucher.findAll({
        raw: true
    }).then((voucher) => {
        res.render('./payment/viewVoucher', { voucher })
    })
        .catch(err => console.log(err));
});

router.post('/createVoucher', (req, res) => {
    // renders views/index.handlebars, passing title as an object
    let name = req.body.name
    let desc = req.body.desc
    let perc = req.body.perc
    let expiryDate = req.body.expiryDate.toString()
    let quantity = req.body.quantity

    Voucher.create({
        voucherName: name, description: desc, percentage: perc, expiryDate: expiryDate, quantity: quantity
    })

    res.redirect('/payment/Vouchers')
});


router.get('/updateVoucher/:id', (req, res) => {
    // renders views/index.handlebars, passing title as an object


    Voucher.findByPk(req.params.id).then((voucher) => {
        res.render('./payment/editVoucher', { voucher })
    })

});

router.post('/updateVoucher/:id', (req, res) => {
    let name = req.body.name
    let desc = req.body.desc
    let perc = req.body.perc
    let expiryDate = req.body.expiryDate.toString()
    let quantity = req.body.quantity

    Voucher.update(
        {
            voucherName: name, description: desc, percentage: perc, expiryDate: expiryDate, quantity: quantity
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' voucher updated');
            res.redirect('/payment/Vouchers');
        })
        .catch(err => console.log(err));
});


router.post('/deleteVoucher/:id', async function (req, res) {
    try {
        let voucher = await Voucher.findByPk(req.params.id)
        if (!voucher) {
            res.redirect('/payment/Vouchers')
            return "Hahaha didn't work";
        }


        Voucher.destroy({ where: { id: req.params.id } })
        res.redirect('/payment/Vouchers')
    }
    catch (err) {

    }
});




router.post('/', (req, res) => {
    let name = req.body.name;
    let cardNumber = req.body.cardDetails1 + req.body.cardDetails2 + req.body.cardDetails3 + req.body.cardDetails4;
    let cardExp = req.body.cardExp.toString();
    let CVC = req.body.CVC;

    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AfJDDolo98rPYD9uMtSOurkdgDEJc5w1StGG4Jl93u2NIbjPOpT1hKWlgmPyIyppDcxZgpeNNMXqMD-e',
        'client_secret': 'EGCtIt8hg_gwS3YXKUP77wcZB1Fj7EmBv4ifuPGHeQSFwFZ8zk870-mHiCO77c-xz2Q_UaIiYNuTcml7'
    });

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for (var i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
})


module.exports = router;
