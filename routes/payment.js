const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	// renders views/index.handlebars, passing title as an object
	res.render('./payment/payment' )
});

router.post('/',(req,res)=>{
let name = req.body.name;
let cardNumber = req.body.cardDetails1 + req.body.cardDetails2 + req.body.cardDetails3 + req.body.cardDetails4;

console.log(name)

})


module.exports = router;
