const path = require('path') // has path and __dirname
const express = require('express')
const server = require('../oauth/server');
const cors = require('cors');

const oauth     = require('../oauth/oauth');


const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath)
})


const corsOptions = {
  origin: function (origin, callback) {
      callback(null, true);
      return;
    
    // const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    // callback(null, originIsWhitelisted);
  }
};

// router.post('/authorize', server.checkCredentials, server.authenticate)
router.post('/token', oauth.token());
router.use(cors(corsOptions));

router.post('/login', server.post_login);
router.get ('/login', server.get_login);
router.get ('/authorize', server.get_authorize);
router.post('/authorize', server.post_authorize);

module.exports = router