const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', // adresse du serveur
user :  'root', // le nom d'utilisateur
password :  'jecode4wcs', // le mot de passe
database :  'funlab', // le nom de la base de données
});
module.exports = connection;