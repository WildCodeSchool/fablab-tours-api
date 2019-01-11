const express = require('express');
const app = express();

const userRoutes = require ('./routes/user.js');
const eventsRoute = require ('./routes/events.js');
const equipeRoute = require ('./routes/equipe.js');
const machinesRoute = require ('./routes/machines.js');
const searchRoute = require ('./routes/search.js');
const contactRoute = require ('./routes/contact.js');
const newsletterRoute = require ('./routes/newsletter.js');

const bodyParser = require('body-parser');
const cors = require('cors');
const NODE_PORT = require('./configuration/constant');

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

// route login user
app.use('/api/auth', userRoutes);

// route events google calendrier
app.use('/api/calendar/events', eventsRoute);

// Route gestion d'équipe
app.use('/api/equipe', equipeRoute);
app.use('/api/ajouterMembre', equipeRoute);

// Route gestion des machines
app.use('/api/machines', machinesRoute);
app.use('/api/ajouterMachine', machinesRoute);

// Route search
app.use('/recherche', searchRoute);
app.use('/recherche/:input', searchRoute);

// envois formulaire contact
app.use('/contact', contactRoute);

// formulaire newsletter
app.use('/subscribe', newsletterRoute);

//connection port 3000
app.listen(NODE_PORT, (err) => {
	if (err) {
		throw new Error('Something bad happened...');
	}
	console.log(`Server is listening on ${NODE_PORT}`);
});