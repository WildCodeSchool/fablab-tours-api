const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors');
const {
	NODE_PORT,
	SESSION_SECRET,
	MAILCHIMP_API_KEY
} = require('./configuration/constant');
const mailer = require('./configuration/mailer');
const connection = require('./configuration/database');
const oauth2Client = require('./configuration/oauth2-client');
const { google } = require('googleapis');
const calendar = google.calendar('v3');
const Mailchimp = require('mailchimp-api-v3');
// const session = require('express-session');

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
// app.use(session({
// 	secret: SESSION_SECRET
// }));

// login user
app.post('/api/auth', function(req, res) {
	const body = req.body;
	const username = body.username; 
	const password = body.password;
	connection.query("SELECT * FROM `user` WHERE `username` = '" + username + "'",
	function (error, results, fields) {
		if (error) {
			// console.log("error ocurred",error);
			res.send({"code":400, "failed":"error ocurred"
		})
	} else {
		// console.log('The solution is: ', results);
		if(results.length >0){
			if(results[0].password == password){
				res.send({"code":200, "success":"connection reussie"
			});
		} else {
			res.send({"code":204, "success":"username and password does not match"
		});
	}
} else {
	res.send({"code":204, "success":"username does not exits"
});
}
}
})
let token = jwt.sign({userID: 1}, 'super-secret', {expiresIn: '2h'});
res.send({token});
});

// Récupération de l 'ensemble des données de la table machines celon la cle de recherche saisie
app.post('/recherche', (req, res) => {
	const motRechercher = req.body.input;
	connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
	${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send('Erreur lors de la récupération des articles');
		} else {
			res.json(results);
		}
	});
});

app.get('/recherche/:input', (req, res) => {
	const motRechercher = req.params.input;
	connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
	${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send('Erreur lors de la récupération des articles');
		} else {
			res.json(results);
		}
	});
});

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
		} else {
			res.json(results);
		}
	});
});

// Récupération de l'ensemble des données de la table equipe.
app.get('/api/equipe', (req, res) => {
	connection.query('SELECT * FROM equipe', (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de la récupération des equipes');
		} else {
			res.json(results);
		}
	});
});

// formulaire de contact 
app.post('/contact', (req, res) => {
	mailer(req.body);
	res.status(200).send();
})

// formulaire newsletter
app.post('/subscribe', (req, res) => {
	const list_id = '336e556020'; // list id
	const mailchimp = new Mailchimp(MAILCHIMP_API_KEY); // create MailChimp instance
	mailchimp.post(`lists/${list_id}`, {
		members: [{ // send a post request to create new subscription to the list
			email_address: req.body.email,
			status: "subscribed"
		}]
	}).then((reslut) => {
		return res.send(reslut);
	}).catch((error) => {
		return res.send(error);
	});
});

// Ajouter membre equipe
app.post('/api/ajouterMembre', (req, res) => {
	// récupération des données envoyées
	const formData = req.body;
	// connexion à la base de données, et insertion membre
	connection.query('INSERT INTO equipe SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout du membre');
		} else {
			res.sendStatus(200);
		}
	});
});

// Ajouter machine
app.post('/api/ajouterMachine', (req, res) => {
	// récupération des données envoyées
	const formData = req.body;
	// connexion à la base de données, et insertion membre
	connection.query('INSERT INTO machines SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout de machine');
		} else {
			res.sendStatus(200);
		}
	});
});

//connection port 3000
app.listen(NODE_PORT, (err) => {
	if (err) {
		throw new Error('Something bad happened...');
	}
	console.log(`Server is listening on ${NODE_PORT}`);
});