const path = require('path');

const NODE_PORT = process.env.NODE_PORT ? process.env.NODE_PORT : '3000';

const SESSION_SECRET = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'bad_secret!';

const DB = process.env.DB ? process.env.DB : 'funlab';
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'root';
const DB_USER = process.env.DB_USER ? process.env.DB_USER : 'toor';
const DB_PORT = process.env.DB_PORT ? process.env.DB_PORT : '3306';
const DB_URI = process.env.DB_URI ? process.env.DB_URI : '';

const MAILER_SERVICE = process.env.MAILER_SERVICE ? process.env.MAILER_SERVICE : 'gmail';
const MAILER_USER = process.env.MAILER_USER ? process.env.MAILER_USER : '';
const MAILER_PASSWORD = process.env.MAILER_USER ? process.env.MAILER_PASSWORD : '';

const MAILCHIMP_API_KEY =  process.env.MAILCHIMP_API_KEY ? process.env.MAILCHIMP_API_KEY : require('../.credentials/mailchimp-key').key;
const OAUTH2_KEY_PATH = process.env.OAUTH2_KEY_PATH ? path.resolve(path.normalize(process.env.OAUTH2_KEY_PATH)) : path.resolve(process.cwd(), path.normalize('.credentials/oauth2-client-id.json'));
const OAUTH2_TOKEN_PATH = process.env.OAUTH2_TOKEN_PATH ? path.resolve(path.normalize(process.env.OAUTH2_TOKEN_PATH)) : path.resolve(process.cwd(), path.normalize('.credentials/oauth2-token.json'));

module.exports.NODE_PORT = NODE_PORT;
module.exports.SESSION_SECRET = SESSION_SECRET;
module.exports.DB = DB;
module.exports.DB_HOST = DB_HOST;
module.exports.DB_PASSWORD = DB_PASSWORD;
module.exports.DB_USER = DB_USER;
module.exports.DB_PORT = DB_PORT;
module.exports.DB_URI = DB_URI;
module.exports.MAILER_SERVICE = MAILER_SERVICE;
module.exports.MAILER_USER = MAILER_USER;
module.exports.MAILER_PASSWORD = MAILER_PASSWORD;
module.exports.MAILCHIMP_API_KEY = MAILCHIMP_API_KEY;
module.exports.OAUTH2_KEY_PATH = OAUTH2_KEY_PATH;
module.exports.OAUTH2_TOKEN_PATH = OAUTH2_TOKEN_PATH;