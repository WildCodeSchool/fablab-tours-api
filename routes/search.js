const express = require('express');
const router = express.Router();

const connection = require('../configuration/database');
const logger = require('../configuration/logger');

// Récupération de l 'ensemble des données de la table machines celon la cle de recherche saisie
router.post('/', (req, res) => {
    const motRechercher = req.body.input;
    connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
        ${motRechercher}' IN NATURAL LANGUAGE MODE)`,null , (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).json({message : 'Erreur lors de la récupération des articles'});
        } else {
          res.status(201).json(results);
        }
      });
  });

// fonction de recherche
router.get('/:input', (req, res) => {
	const motRechercher = req.params.input;
	connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
      ${motRechercher}' IN NATURAL LANGUAGE MODE)`,null ,(err, results) => {
		if (err) {
      logger.error(err);
			res.status(400).json({message : 'Erreur lors de la récupération des articles'});
		} else {
			res.status(200).json(results);
		}
	});
});

module.exports = router;