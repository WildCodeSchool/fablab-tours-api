const express = require('express');
const app = express();
const userRoutes = require ('./routes/user.js');
const publicRoutes = require ('./routes/public.js');
const bodyParser = require('body-parser');

const cors = require('cors');
const {
	NODE_PORT,
	SESSION_SECRET,
	MAILCHIMP_API_KEY
} = require('./configuration/constant');
const mailer = require('./configuration/mailer');
const connection = require('./configuration/database');

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
app.use('/api/auth', userRoutes);
// récuperer les evenements google calendrier
app.use('/api/calendar/events', publicRoutes);

// fonction de recherche
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
	const formData = req.body;
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
	const formData = req.body;
	connection.query('INSERT INTO machines SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout de machine');
		} else {
			res.sendStatus(200);
		}
	});
});


//Modifier un membre de l'equipe
app.put('/modifier/:id', (req, res) => {
	const idEq = req.params.id;
	const data = req.body;
	
	connection.query('UPDATE equipe SET ? WHERE id= ?', [data, idEq], (err) => {
		if (err) {
			console.log(err);
			res.status(500).send("Erreur lors de la modification d'un membre");
		} else {
			res.sendStatus(200);
		}
	});
});

//Supprimer un membre de l'equipe
app.delete('/supprimer/:id', (req, res) => {
	const idEq = req.params.id;
	connection.query('DELETE from equipe  WHERE id= ?', [idEq], (err) => {
		if (err) {
			console.log(err);
			res.status(500).send("Erreur lors de la suppression d'un membre");
		} else {
			res.status(204).send();
		}
	});
});


//Modifier une machine
app.put('/modifiermachine/:id', (req, res) => {
	const idMachine = req.params.id;
	const data = req.body;

	connection.query('UPDATE machines SET ? WHERE id_machine= ?', [data, idMachine], (err) => {
		if (err) {
			console.log(err);
			res.status(500).send("Erreur lors de la modification d'une machine");
		} else {
			res.status(204).send();
		}
	});
});

//Supprimer une machine
app.delete('/supprimermachine/:id', (req, res) => {
	const idMachine = req.params.id;
	connection.query('DELETE from machines  WHERE id_machine= ?', [idMachine], (err) => {
		if (err) {
			console.log(err);
			res.status(500).send("Erreur lors de la suppression d'une machine");
		} else {
			res.status(204).send();
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