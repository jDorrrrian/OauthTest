
const OAuth2Server = require('oauth2-server');
const db = require('./db');
const Op = require('sequelize');
const { Client } = require('../models');

const oauth = require("./oauth");
var util = require('util');
const crypto = require('crypto');

const fs = require('fs');
const jwt = require('jsonwebtoken');

const signingOptions = {
    issuer : 'Colab.re api',
    subject: 'userAuth',
    expiresIn: "7d",
    algorithm: "RS256"
}

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
var privateKEY  = fs.readFileSync('./private.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.key', 'utf8');


module.exports.getToken = (req, res, next) => {
    let request  = new Request(req);
    let response = new Response(res);
    console.log(request);
    return oauth.token(request, response)
        .then(token => {
            return res.json(token);
        })
        .catch(err => {
            return res.status(500).json(err);
        })

}

module.exports.get_client = (req, res, next) => {
    console.log(req);
    db.model.getClientById(req.query.id)
        .then( client => {
            return res.json(client);
        })
}

module.exports.authenticate = (req, res, next) => {
    console.log(req);
    
    let request  = new Request(req);
    let response = new Response(res);

    db.model.getUser(req.body.email, req.body.password)
        .then(user => {
            return res.json(user);
        })

}

module.exports.get_login = (req, res, next) => {
    console.log(req.app);
    return res.json( {
        page: 'login',
        redirect: req.query.redirect,
        client_id: req.query.id,
        redirect_uri: req.query.redirect_uri
    });
    
}


module.exports.post_login = (req, res, next) => {
    let response = new Response(res);
    
    let request = new Request(req);
    db.model.getUser(request.body.email, request.body.password)
        .then(user => {
            

            let token = jwt.sign(user,privateKEY,signingOptions);
            console.log(token);
            console.log(request.body.query);
            
            return res.json({
                token,
                ...request.body
            })
        })

}

module.exports.post_authorize = (req, res, next) => {
    let request = new Request(req);
    let response = new Response(res);


    var token = crypto.randomBytes(32).toString('hex');
    let decode = jwt.decode(request.body.headers['x-user-auth-token'], publicKEY, signingOptions);

    let expire = new Date();
    expire.setMonth(expire.getMonth() + 1);

    let code = {
        authorizationCode: token,
        redirect_uri: request.body.data.redirect_uri,
        scope : request.body.data.scope,
        expiresAt : expire
    }

    db.model.saveAuthorizationCode(code, request.body.data.client_id, decode.id );
    return res.json({
        code: token,
        state: request.body.data.state
    })
}

//0
//"{'http://localhost:3030/redirection/0/w09u340aw', 
//  'http://localhost:3030/redirection/0/09ru213oje'}"

module.exports.get_authorize = (req, res, next) => {
    console.log("\n======================\n get_authorize has been called");

    return Client.findOne({
        where: {
            id: req.query.client_id,
        },
        raw: true
    }).then(client => {

        if(!client) return res.status(400).json({error: 'Invalid Client'});
        console.log(client);

        return client.redirectUris.forEach((uri, index) => {

            if(uri == req.query.redirect_uri){
                client.redirectUris = [uri];

                return res.json(client)
            }

            if(index+1 == client.redirectUris.length) 
                return res.status(400).json({error: 'Uri Not Found'}); 
        })
    }).catch(err => {
        return res.status(err.code || 500).json(err)
    })
}
