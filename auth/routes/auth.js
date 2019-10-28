const path = require('path') // has path and __dirname
const express = require('express')
const server = require('../oauth/server');


const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath)
})
// router.post('/authorize', server.checkCredentials, server.authenticate)




module.exports = router
