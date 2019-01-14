const express = require('express');
const router = express.Router();
const passport = require('passport');
const connection = require('../configuration/database');

// Récupération de l'ensemble des données de la table equipe.
router.get('/', (req, res) => {
	connection.query('SELECT * FROM equipe', (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de la récupération des equipe');
		} else {
			res.json(results);
		}
	});
});

// Ajouter membre equipe
router.post('/', passport.authenticate('jwt', { session : false }), (req, res) => {
	const formData = req.body;
	connection.query('INSERT INTO equipe SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout du membre');
		} else {
			res.sendStatus(200);
		}
	});
});

//Modifier un membre de l'equipe
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;