const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const title = 'Curosa';
	// renders views/index.handlebars, passing title as an object
	res.render('index', { title: title })
});

router.get('/mycourse', (req, res) => {
	res.render('mycourse');
});

module.exports = router;
