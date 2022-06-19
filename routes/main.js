const express = require('express');
const router = express.Router();

router.get('/', (req, res,) => {
	// renders views/index.handlebars, passing title as an object
	res.render('index')
});

router.get('/mycourse', (req, res) => {
	res.render('mycourse');
});

module.exports = router;
