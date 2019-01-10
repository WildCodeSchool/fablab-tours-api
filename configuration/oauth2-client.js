const fs = require('fs');
const googleAuth = require('google-auth-library');
const { OAUTH2_KEY_PATH, OAUTH2_TOKEN_PATH } = require('./constant');
const oauth2keys = require(OAUTH2_KEY_PATH);

const googleSecrets = oauth2keys.installed;

var oauth2Client = new googleAuth.OAuth2Client(
    googleSecrets.client_id,
    googleSecrets.client_secret,
    googleSecrets.redirect_uris[0]
);

const token = fs.readFileSync(OAUTH2_TOKEN_PATH);

oauth2Client.setCredentials(JSON.parse(token));

module.exports = oauth2Client;