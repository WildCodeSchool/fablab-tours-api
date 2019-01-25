const express = require('express');
const router = express.Router();
const passport = require('passport');

const connection = require('../configuration/database');
const logger = require('../configuration/logger');

// Récupération de l'ensemble des données de la table machines.
router.get('/', (req, res) => {
	connection.query('SELECT * FROM machines', null, (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message: 'Erreur lors de la récupération des machines'});
		} else {
			res.status(200).json(results);
		}
	});
});

// Ajouter machine
router.post('/', passport.authenticate('jwt', { session : false }), (req, res) => {
	const formData = req.body;
	connection.query('INSERT INTO machines SET ?', formData, (err, results) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message :'Erreur lors de l\'ajout de machine'});
		} else {
			res.status(201).end();
		}
	});
});

//Modifier une machine
router.put('/:id', passport.authenticate('jwt', { session : false }), (req, res) => {
	const idMachine = req.params.id;
	const data = req.body;

	connection.query('UPDATE machines SET ? WHERE id_machine= ?', [data, idMachine], (err) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message :"Erreur lors de la modification d'une machine"});
		} else {
			res.status(204).end();
		}
	});
});

//Supprimer une machine
router.delete('/:id(\\d+)', passport.authenticate('jwt', { session : false }), (req, res) => {
	const idMachine = req.params.id;
	connection.query('DELETE from machines  WHERE id_machine= ?', [idMachine], (err) => {
		if (err) {
			logger.error(err);
			res.status(400).json({message :"Erreur lors de la suppression d'une machine"});
		} else {
			res.status(204).end();
		}
	});
});

module.exports = router;