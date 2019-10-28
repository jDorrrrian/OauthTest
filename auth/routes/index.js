const express = require('express')


var oauth2lib = require('oauth20-provider');
var oauth2 = new oauth2lib({log: {level: 2}});

const router = express.Router() // Instantiate a new router

// router.use(oauth2.inject());

// router.get('/auth/authorization', isAuthorized, oauth2.controller.authorization, (req,res) => {
//     res.render()
// })


router.use("/auth", require("./auth"));
router.use("/secure", require("./secure"));
router.use("/public", require("./public"));

module.exports = router;
// Note that the next router uses middleware. That protects all routes within this middleware
// app.use('/secure', (req,res,next) => {
//     return next()
//   },oauthServer.authenticate(), require('./secure.js')) // routes to access the protected stuff
//   app.use('/', (req,res) => res.redirect('/client'))
  
