const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// connection bdd mysql
const connection = require('./configuration');

//connection nodemailer
const configuration = require('./configContact');

//newsletter
const Mailchimp = require('mailchimp-api-v3');

//connection google calendar
const fs = require('fs');
const { google } = require('googleapis');
const googleAuth = require('google-auth-library');

//middleware
app.use(cors())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// api calendrier
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	process.env.USERPROFILE) + '/.credentials/';
	const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
	
	const googleSecrets = JSON.parse(fs.readFileSync('./oAuth/client_secret.json')).installed;
	const oauth2Client = new googleAuth.OAuth2Client(
		googleSecrets.client_id,
		googleSecrets.client_secret,
		googleSecrets.redirect_uris[0]
		);
		
		const token = fs.readFileSync(TOKEN_PATH);
		oauth2Client.setCredentials(JSON.parse(token));
		
		const calendar = google.calendar('v3');
		
		// récuperer les evenements
		app.get('/api/calendar/events', (req, res) => {
			calendar.events.list({
				auth: oauth2Client,
				calendarId: "1gbcvqi2d34kgb39nt666dh4hc@group.calendar.google.com",
				timeMin: (new Date()).toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
			}, function (err, response) {
				if (err) {
					console.log('The API returned an error: ' + err);
					res.sendStatus(500);
					return;
				}
				const events = response.data.items;
				res.json(events);
			});
		});
		
		// Récupération de l'ensemble des données de la table machines.
		app.get('/api/machines', (req, res) => {
			connection.query('SELECT * FROM machines', (err, results) => {
				if (err) {
					res.status(500).send('Erreur lors de la récupération des machines');
				}
				else {
					res.json(results);
				}
			});
		});
		
		// Récupération de l'ensemble des données de la table equipe.
		app.get('/api/equipe', (req, res) => {
			connection.query('SELECT * FROM equipe', (err, results) => {
				if (err) {
					res.status(500).send('Erreur lors de la récupération des equipes');
				}
				else {
					res.json(results);
				}
			});
		});
		
		// formulaire de contact 
		app.post('/contact', (req, res) => {
			configuration(req.body);
			res.status(200).send();
		})
		
		
		// formulaire newsletter
		app.post('/subscribe', (req, res) => {
			const api_key = '988c33228bec9d56d5f9912584c0f507-us13'; // api key -
			const list_id = '336e556020'; // list id
			const mailchimp = new Mailchimp(api_key); // create MailChimp instance
			mailchimp.post(`lists/${list_id}`, { members: [{ // send a post request to create new subscription to the list
				email_address:req.body.email,
				status: "subscribed"
			}]
		}).then((reslut) => {
			return res.send(reslut);
		}).catch((error) => {
			return res.send(error);
		});
	});
	
	//connection port 3000
	app.listen(port, (err) => {
		if (err) {
			throw new Error('Something bad happened...');
		}
		console.log(`Server is listening on ${port}`);
	});