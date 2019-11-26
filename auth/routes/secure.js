const path = require('path') // has path and __dirname
const express     = require('express')
const oauthServer = require('../oauth/server.js')

const db          = require('../oauth/db');
const oauth       = require('../oauth/oauth');
const router      = express.Router() // Instantiate a new router


router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.send({"text": "Amazing, you did"})
})

router.get('/user', oauth.authenticate({scope: 'profile'}), (req,res) => {  // send back a simple form for the oauth
  db.model.getUserFromToken(req.headers.authorization.split(' ')[1])
    .then(user => {
      res.send(user) 
    })
})

router.get('/wall', oauth.authenticate({scope : 'wall'}),  (req, res) => {
  res.send({"text": "You're only getting wall info here."})
})


module.exports = router
