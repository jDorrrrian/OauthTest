const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')



const router = express.Router() // Instantiate a new router


router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.send({"text": "Amazing, you did"})
})



module.exports = router
