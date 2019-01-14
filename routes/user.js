const express = require('express');
const router = express.Router();
const passport = require('passport');
const { JWT_SECRET } = require('../configuration/constant');

const connection = require('../configuration/database');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// app.use('/api', expressJwt({ secret: JWT_SECRET }).unless({ path: ['/api/auth', '/api/calendar/events', '/recherche', '/api/equipe', '/api/ajouterMembre', '/api/ajouterMachine'] }));

// login user
router.post('/', function (req, res, next) {
	passport.authenticate('login', async (err, user, info) => {
		if (err || !user) {
			const error = new Error('An Error occured')
			res.status(401).json({ message: 'bad credentials'});
			return;
		}
		req.login(user, { session: false }, async (error) => {
			if (error) return next(error)
			//We don't want to store the sensitive information such as the
			//user password in the token so we pick only the email and id
			const body = { id: user.id, username: user.username };
			//Sign the JWT token and populate the payload with the user email and id
			const token = jwt.sign({ user: body }, JWT_SECRET);
			//Send back the token to the user
			return res.json({ token });
		});
	})(req, res, next);
});

module.exports = router;