const express = require('express');
const router = express.Router();

const mailer = require('../configuration/mailer');

// formulaire de contact 
router.post('/', (req, res) => {
	mailer(req.body);
	res.status(200).send();
})

module.exports = router;