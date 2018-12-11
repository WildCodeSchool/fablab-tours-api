const express = require('express');
const app = express();
const port = 3000;
const connection = require('./configuration');
const bodyParser = require('body-parser');

//middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



// Récupération de l 'ensemble des données de la table machines
app.get('/api/machines', (req, res) => {
    connection.query('SELECT * from machines', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des machines');
        } else {
            res.json(results);
        }
    });
});


app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});