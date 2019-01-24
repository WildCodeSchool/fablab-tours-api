const express = require('express');
const router = express.Router();

const oauth2Client = require('../configuration/oauth2-client');
const { google } = require('googleapis');
const calendar = google.calendar('v3');
const logger = require('../configuration/logger');

// récuperer les evenements
router.get('/', (req, res) => {
	calendar.events.list({
		auth: oauth2Client,
		calendarId: "1gbcvqi2d34kgb39nt666dh4hc@group.calendar.google.com",
		timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime',
	}, function (err, response) {
		if (err) {
			logger.error(err);
			res.stauts(400).json({ message: `The goolgle API returned an error` });
			return;
		}
		const events = response.data.items;
		res.status(200).json(events);
	});
});

module.exports = router;