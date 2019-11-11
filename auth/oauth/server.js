
const OAuth2Server = require('oauth2-server');
const db = require('./db');
const Op = require('sequelize');
const { Client } = require('../models');

const oauth = require("./oauth");
var util = require('util');

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

// var render = require('co-views')('views');



// module.exports.checkCredentials = (req, res, next) => {

//     let REQ = OAuth2Server.Request(req);
//     let RES = OAuth2Server.Response(res);
//     // OAuth2Server.authenticate(REQ,RES, {}, ret => {
//     //     ret.
//     // })
//     console.log("req\n==================================================================================== \n", req);
//     // console.log("res\n==================================================================================== \n",res);
//     return ColabUser.findOne({
//         where:{
//             email : req.body.email,
//             password : req
//         }
//     }).then(entries => {
        

//         if( entries.length =! 1){
            
//             const params = [ // Send params back down
//                 'client_id',
//                 'redirect_uri',
//                 'response_type',
//                 'grant_type',
//                 'state',
//             ]
//             .map(a => `${a}=${req.body[a]}`) 
//             .join('&');
//             return res.redirect(`/oauth?success=false&${params}`);
//         }else{
//             req.body.user = entries;
//             return next();
//         }
//     }).catch(er => {
//         console.log(er);
//     });
// }





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

module.exports.authenticate = (req, res, next) => {
    console.log(req);
    
    let request  = new Request(req);
    let response = new Response(res);

    db.model.getUser(req.body.email, req.body.password)
        .then(user => {
            return res.json(user);
        })


    // return oauth.authorize(request, response)
    //     .then(code => {
    //         return res.json(code);
    //     })
    //     .catch(err => {
    //         return res.status(400).json(err);
    //     })
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
    // console.log(req.app.locals);
    db.model.getUser(req.body.email, req.body.password)
        .then(user => {
            console.log(req);
            // return res.json(user);
            var path = 'http://localhost:8080/auth/authorization' ;
            // console.log(req.body);
            // console.log(util.format('/%s?client_id=%s&redirect_uri=%s', path, req.body.query.client_id, req.body.query.redirect_uri));
            res.json({
                user,
                ...req.body
            })
            // return res.redirect(util.format('%s?client_id=%s&redirect_uri=%s', path, req.body.query.client_id, req.body.query.redirect_uri));
        })

}


module.exports.post_authorize = (req, res, next) => {
    let request = new Request(req);
    let response = new Response(res);

    if(!req.app.locals.user){
        
    }
    return oauth.authorize(request, response)
        .then(success => {
              // Successful logins should send the user back to /oauth/authorize.
                res.json(success);
        })
        .catch(err => {
            res.status(err.code || 500).json(err);
        })
}

//0
//"{'http://localhost:3030/redirection/0/w09u340aw', 
//  'http://localhost:3030/redirection/0/09ru213oje'}"

module.exports.get_authorize = (req, res, next) => {
    console.log("get_authorize has been called");

    if (!req.app.locals.user) {
        return res.redirect(util.format('/login?redirect=%s&client_id=%s&redirect_uri=%s', req.path, req.query.client_id, req.query.redirect_uri));
    }

    // console.log(Op);
    return Client.findAll({
        where: {
            id: req.query.clientId,
        },
        raw: true
    }).then(client => {


        if(!client) return res.status(400).json({error: 'Invalid Client'});

        return client[0].redirectUris.forEach((uri, index) => {

            if(uri == req.query.redirectUri){
                client[0].redirectUris = [uri];

                return res.json(client)
            }

            if(index+1 == client[0].redirectUris.length) 
                return res.status(400).json({error: 'Uri Not Found'}); 
        })
    }).catch(err => {
        return res.status(err.code || 500).json(err)
    })
}
