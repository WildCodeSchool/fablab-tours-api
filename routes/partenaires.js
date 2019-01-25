const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../configuration/logger');

const connection = require('../configuration/database');

// Récupération des partenanires financiers.
router.get('/', (req, res) => {
	connection.query('SELECT * FROM partenaires', (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: 'Erreur lors de la récupération des partenaires'});
		} else {
			res.status(200).json(results);
		}
	});
});

// Récupération des partenanires financiers.
router.get('/financiers', (req, res) => {
	connection.query('SELECT * FROM partenaires WHERE status = "Partenaire Financier"', (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: 'Erreur lors de la récupération des partenaires financiers'});
		} else {
			res.status(200).json(results);
		}
	});
});

// Récupération des partenanires technique.
router.get('/techniques', (req, res) => {
	connection.query('SELECT * FROM partenaires WHERE status = "Partenaire Technique"', (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: 'Erreur lors de la récupération des partenaires techniques'});
		} else {
			res.status(200).json(results);
		}
	});
});

// Ajouter partenaires
router.post('/', passport.authenticate('jwt', { session : false }), (req, res) => {
	const formData = req.body;
	connection.query('INSERT INTO partenaires SET ?', formData, (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: `Erreur lors de l\'ajout du partenaire`});
		} else {
			res.status(201).end();
		}
	});
});

//Modifier un partenaire
router.put('/:id', passport.authenticate('jwt', { session : false }), (req, res) => {
	const idPartenaire = req.params.id;
	const data = req.body;

	connection.query('UPDATE partenaires SET ? WHERE id_partenaire= ?', [data, idPartenaire], (err) => {
		if (err) {
			logger.error(err);
			res.status(500).json({message: "Erreur lors de la modification d'un partenaire"});
		} else {
			res.status(204).send();
		}
	});
});

//Supprimer un partenaire
router.delete('/:id(\\d+)', passport.authenticate('jwt', { session : false }), (req, res) => {
	const idPartenaire = req.params.id;
	connection.query('DELETE from partenaires  WHERE id_partenaire= ?', [idPartenaire], (err) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: "Erreur lors de la suppression d'un partenaire"});
		} else {
			res.status(204).send();
		}
	});
});

module.exports = router;