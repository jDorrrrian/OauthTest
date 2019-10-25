const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')



const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.send("you made it to the front page, amazing.")
})


module.exports = router
