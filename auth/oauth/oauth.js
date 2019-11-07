
const OAuth2Server = require("oauth2-server");
const db = require('./db');
const ExpressOauth= require('express-oauth-server');

config = {
    model: db.model,
    grants: ['authorization_code'], //, 'refresh_token'
    accessTokenLifetime: 60 * 60 * 24 * 7, // 24 hours, or 1 day
    allowEmptyState: true,
    debug: true,
    allowExtendedTokenAttributes: true,

}

const expressOauth = new ExpressOauth(config)
const oauth = new OAuth2Server(config);

module.exports = expressOauth