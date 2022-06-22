const express = require('express');
const router = express.Router();
var paypal = require('paypal-rest-sdk');
const clientId = "AfJDDolo98rPYD9uMtSOurkdgDEJc5w1StGG4Jl93u2NIbjPOpT1hKWlgmPyIyppDcxZgpeNNMXqMD-e";
const secret = "EGCtIt8hg_gwS3YXKUP77wcZB1Fj7EmBv4ifuPGHeQSFwFZ8zk870-mHiCO77c-xz2Q_UaIiYNuTcml7";




router.get('/', (req, res) => {
	// renders views/index.handlebars, passing title as an object
	res.render('./payment/payment' )
});

router.post('/',(req,res)=>{
let name = req.body.name;
let cardNumber = req.body.cardDetails1 + req.body.cardDetails2 + req.body.cardDetails3 + req.body.cardDetails4;
let cardExp = req.body.cardExp.toString();
let CVC = req.body.CVC ; 

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
		for(var i=0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
				res.redirect(payment.links[i].href);
			  }
		}
    }
});


})


module.exports = router;
