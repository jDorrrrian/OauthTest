const express = require('express')

const app = express()
const port = 3030
const bodyParser = require('body-parser');
const oauthServer = require('./oauth/server.js');
const oauth     = require('./oauth/oauth');

app.oauth = oauth;


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/', require('./routes/index'));


app.listen(port)
console.log("Oauth Server listening on port ", port)

module.exports = app // For testing
