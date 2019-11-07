const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')



const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/client/home.html')


// router.get('/auth', oauthServer.authenticate);


router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath);
})


module.exports = router
