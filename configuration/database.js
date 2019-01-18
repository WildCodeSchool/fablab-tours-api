const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB} = require('./constant');

const connection = mysql.createConnection({
    host: DB_HOST, // adresse du serveur
    user: DB_USER, // le nom d'utilisateur
    password: DB_PASSWORD, // le mot de passe
    database: DB, // le nom de la base de données
});

module.exports = connection;