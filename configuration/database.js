const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB, DB_POOL_LIMIT} = require('./environment');
const logger = require('./logger');

const pool = mysql.createPool({
    connectionLimit : DB_POOL_LIMIT,
    host: DB_HOST, // adresse du serveur
    user: DB_USER, // le nom d'utilisateur
    password: DB_PASSWORD, // le mot de passe
    database: DB, // le nom de la base de données
});

class Connection {
    constructor(pool) {
        this.pool = pool;
    }

    query(query, params, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                if (connection) connection.release();
                callback(err, null);
                return;
            }
            connection.query(query, params, (err, rows) => {
                if (connection) {
                    connection.release();
                }
                if (!err) {
                    callback(null, rows);
                }
                else {
                    callback(err, null);
                }

            });

            connection.on('error', (err) =>{
                logger.error('Connection error', err)
                if (connection) connection.release();
                callback(err, null);
                return;
            });
        });
    }
} 

module.exports = new Connection(pool);