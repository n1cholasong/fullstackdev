const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const title = 'Curosa';
	// renders views/index.handlebars, passing title as an object
	res.render('./payment/payment' )
});


module.exports = router;
