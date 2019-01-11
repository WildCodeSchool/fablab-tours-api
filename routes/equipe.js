const express = require('express');
const router = express.Router();

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
router.post('/', (req, res) => {
	const formData = req.body;
	connection.query('INSERT INTO equipe SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout du membre');
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;