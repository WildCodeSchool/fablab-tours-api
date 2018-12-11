const express = require('express');
const app = express();
const oAuth2 = require('./oAuth');
const port = 3000;
const connection = require('./configuration');
const bodyParser = require('body-parser');

const { google } = require('googleapis');

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

// api calendrier
function listEvents(auth) {
    return new Promise(function (resolve, reject) {
  
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) {
          reject(err); 
          return;
        }
        resolve(res.data.items);
  
      });
    });
  }
  
  app.get('/api/calendar/events', function (req, res) {
    oAuth2.getToken((token) => {
      listEvents(token)
      .then((events) => {
        res.json(events);
      })
      .catch((err) => {
        res.status(500).json(err);
      })
    })
  });
  


app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});