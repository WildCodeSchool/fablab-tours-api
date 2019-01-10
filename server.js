const express = require('express');
const session = require('express-session');
const Mailchimp = require('mailchimp-api-v3');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
const {
	google
} = require('googleapis');
const {
	NODE_PORT,
	SESSION_SECRET,
	MAILCHIMP_API_KEY
} = require('./configuration/constant');
const mailer = require('./configuration/mailer');
const connection = require('./configuration/database');
const oauth2Client = require('./configuration/oauth2-client');

const calendar = google.calendar('v3');
const app = express();

//middleware
app.use(cors())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.use(session({
	secret: SESSION_SECRET
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

// login user
passport.use(new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'username',
		passwordField: 'password',
	},
	function (username, password, cb) {
		connection.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function (err, results) {
			if (err)
				return cb(err);
			if (results.length === 0) {
				return cb(null, false);
			}
			// if the user is found but the password is wrong
			if (!(results[0].password === password)) {
				return cb(null, false); // create the loginMessage and save it to session as flashdata

			} else {
				return cb(null, results[0])
			}
		})
	}));

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	connection.query("SELECT * FROM `user` WHERE `id` = ? ", id, function (err, results) {
		if (err)
			return cb(err);
		if (results.length === 0) {
			return cb(new Error('Unknown user'));
		} else {
			return cb(null, results[0])
		}
	})
});

// Récupération de l 'ensemble des données de la table machines celon la cle de recherche saisie
// app.post('/recherche', (req, res) => {
//   const motRechercher = req.body.input;
//   connection.query(`SELECT * from machines where match(nom_machine,description) AGAINST ('
//       ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
//     if (err) {
//       res.status(500).send('Erreur lors de la récupération des machines');
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/recherche/:input', (req, res) => {
//   const motRechercher = req.params.input;
//   connection.query(`SELECT * from machines where match(nom_machine,description) AGAINST ('
//       ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
//     if (err) {
//       res.status(500).send('Erreur lors de la récupération des machines');
//     } else {
//       res.json(results);
//     }
//   });
// });

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

// app.post('/api/login', 
//   passport.authenticate('local'),
//   function(req, res) {
//     res.sendStatus(200);
// });
app.post('/api/login',
	passport.authenticate('local', {
		successRedirect: '/api/equipe',
		failureRedirect: '/api/login',
		failureFlash: true
	}),
	function (req, res) {
		console.log(req.body);
		res.sendStatus(200);
	});


function checkAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		//req.isAuthenticated() will return true if user is logged in
		next();
	} else {
		res.sendStatus(401);
	}
}

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