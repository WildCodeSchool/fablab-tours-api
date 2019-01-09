const express = require('express');
const app = express();
const oAuth2 = require('./oAuth');
const port = 3000;
const connection = require('./configuration');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const configuration = require('./configContact');

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

// Récupération de l 'ensemble des données de la table machines celon la cle de recherche saisie
// app.post('/recherche', (req, res) => {
//   const motRechercher = req.body.input;
//   connection.query(`SELECT * from machines where match(nom_machine,description) AGAINST ('
//       ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
//     if (err) {
//       res.status(500).send('Erreur lors de la récupération des machines');
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/recherche/:input', (req, res) => {
//   const motRechercher = req.params.input;
//   connection.query(`SELECT * from machines where match(nom_machine,description) AGAINST ('
//       ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
//     if (err) {
//       res.status(500).send('Erreur lors de la récupération des machines');
//     } else {
//       res.json(results);
//     }
//   });
// });

// Récupération de l 'ensemble des données de la table machines celon la cle de recherche saisie
app.post('/recherche', (req, res) => {
  const motRechercher = req.body.input;
  connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
      ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des articles');
      } else {
        res.json(results);
      }
    });
});

app.get('/recherche/:input', (req, res) => {
  const motRechercher = req.params.input;
  connection.query(`SELECT * from wp_posts where match(post_content,post_title) AGAINST ('
      ${motRechercher}' IN NATURAL LANGUAGE MODE)`, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récupération des articles');
      } else {
        res.json(results);
      }
    });
});





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

// Récupération de l'ensemble des données de la table equipe.
app.get('/api/equipe', (req, res) => {
	connection.query('SELECT * FROM equipe', (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de la récupération des equipes');
		}
		else {
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

  // formulaire de contact 
  app.post('/contact', (req, res) => {
    configuration(req.body);
    res.status(200).send();
   })

app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }
    console.log(`Server is listening on ${port}`);
});