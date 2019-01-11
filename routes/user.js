const express = require('express');
const app = express();
const router = express.Router();

const connection = require('../configuration/database');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//middleware
app.use("/api", router);
// app.use('/api', expressJwt({secret: 'supersecret'}).unless({path: ['/api/auth', '/api/calendar/events','/api/machines',
//  '/recherche', '/api/equipe', '/api/ajouterMembre', '/api/ajouterMachine']}));

// login user
router.post('/', function(req, res) {
	const body = req.body;
	const username = body.username; 
	const password = body.password;
	connection.query("SELECT * FROM `user` WHERE `username` = '" + username + "'",
	function (error, results, fields) {
		if (error) {
		   res.send({"code":400, "failed":"error ocurred"})
		} else {
		  	if(results.length > 0){
				if(results[0].password === password){
					const token = jwt.sign({ userID: results[0].id }, 'supersecret', {expiresIn: '2h'});
			 			res.send({ auth: true, token: token });
					} else {
					res.send({"code":204, "success":"username and password does not match"});
					}
		  		} else {
				res.send({"code":204, "success":"username does not exits"});
			}
		}
	})
});

module.exports = router;