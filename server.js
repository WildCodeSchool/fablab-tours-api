const express = require('express');
const app = express();

const userRoute = require ('./routes/user.js');
const eventsRoute = require ('./routes/events.js');
const equipeRoute = require ('./routes/equipe.js');
const machinesRoute = require ('./routes/machines.js');
const partenairesRoute = require ('./routes/partenaires.js');
const searchRoute = require ('./routes/search.js');
const contactRoute = require ('./routes/contact.js');
const newsletterRoute = require ('./routes/newsletter.js');

const bodyParser = require('body-parser');
const cors = require('cors');
const { NODE_PORT } = require('./configuration/environment');
const logger = require('./configuration/logger');
require('./routes/authentification');

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

app.use(static(LOG_FILE_PATH));

// route login user
app.use('/api/auth', userRoute);

// route events google calendrier
app.use('/api/calendar/events', eventsRoute);

// Route gestion d'équipe
app.use('/api/equipe', equipeRoute);

// Route gestion des machines
app.use('/api/machines', machinesRoute);

// Route gestion des partenaires
app.use('/api/partenaires', partenairesRoute);

// Route search
app.use('/api/recherche', searchRoute);
// app.use('/recherche/:input', searchRoute);

// envois formulaire contact
app.use('/api/contact', contactRoute);

// formulaire newsletter
app.use('/api/subscribe', newsletterRoute);

//connection port 3000
app.listen(NODE_PORT, (err) => {
	logger.debug('hhhhhhh')
	if (err) {
		throw new Error('Something bad happened...');

	}
	console.log(`Server is listening on ${NODE_PORT}`);
});