const express = require('express');
const router = express.Router();

const oauth2Client = require('../configuration/oauth2-client');
const { google } = require('googleapis');
const calendar = google.calendar('v3');

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
			console.log('The API returned an error: ' + err);
			res.status(500).end();
			return;
		}
		const events = response.data.items;
		res.json(events);
	});
});

module.exports = router;