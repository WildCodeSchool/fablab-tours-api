const express = require('express');
const router = express.Router();

const connection = require('../configuration/database');

// Récupération de l'ensemble des données de la table machines.
router.get('/', (req, res) => {
	connection.query('SELECT * FROM machines', (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de la récupération des machines');
		} else {
			res.json(results);
		}
	});
});

// Ajouter machine
router.post('/', (req, res) => {
	const formData = req.body;
	connection.query('INSERT INTO machines SET ?', formData, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de l\'ajout de machine');
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;