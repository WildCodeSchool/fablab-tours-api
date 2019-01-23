const express = require('express');
const router = express.Router();

const { MAILCHIMP_API_KEY } = require('../configuration/environment');

const Mailchimp = require('mailchimp-api-v3');
const logger = require('../configuration/logger');

// formulaire newsletter
router.post('/', (req, res) => {
	const list_id = '336e556020'; // list id
	const mailchimp = new Mailchimp(MAILCHIMP_API_KEY); // create MailChimp instance
	mailchimp.post(`lists/${list_id}`, {
		members: [{ // send a post request to create new subscription to the list
			email_address: req.body.email,
			status: "subscribed"
		}]
	}).then((reslut) => {
		res.send(reslut);
	}).catch((error) => {
		logger.error(error);
		res.status(500).json({message: 'Error while trying to send mail'});
	});
});

module.exports = router;