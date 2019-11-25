const { Token, AuthorizationCode, Client, User } = require('../models');
const crypto = require('crypto');
const _ = require('lodash');

const VALID_SCOPES= [
    'profile_read',
    'location_read',
    'profile',
    'wall'
]
// secret: "12345678900987654321"
// id: 0

module.exports.model = {
    
    getAccessToken: function(bearerToken) {
        /* This is where you select the token from the database where the code matches */
        return Token.findOne({
            where : {
                accessToken : bearerToken
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'name']
                }, Client
            ]
        }).then( token => token.toJSON() )
        .then( res => {
            console.log("\n=======================================\n getAccessToken")
            console.log(res);
            return {
                accessToken : res.accessToken,
                accessTokenExpiresAt : res.accessTokenExpiresAt,
                scope: res.scope,
                user : res.User,
                client : res.Client,
            }
        })
        .catch(er => {
            console.log("accessToken error: " + er)
        })
    },
    
    getClient : function (id, clientSecret) {
        // query db for details with client
        return Client.findOne({
            where : {
                id, 
                clientSecret
            },

        }).then( client => {
            if(!client) return new Error("client not found");
            let c = client.toJSON()
            c.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials'];
            
            return c;
        }).catch(err => {
            console.log("getClient error: ", err);
        })
    },/*
{ id: 21,
  authorizationCode: '426809e84a1deb12526251e7378d424fdcb13f6dab2234ed37d8ef5570f5d4ff',
  expiresAt: 2019-12-13T20:41:03.000Z,
  redirectUri: 'http://localhost:3030/redirection/0/09ru213oje',
  scope: 'profile',
  createdAt: '2019-11-13',
  updatedAt: '2019-11-13',
  deletedAt: null,
  client: 
   { id: 0,
     clientSecret: '12345678900987654321',
     grants: [ 'authorization_code' ],
     redirectUris: 
      [ 'http://localhost:3030/redirection/0/w09u340aw',
        'http://localhost:3030/redirection/0/09ru213oje' ],
     scope: 'profile',
     createdAt: null,
     updatedAt: null,
     deletedAt: null },
  user: 
   { id: 0,
     facebookId: '12456789',
     facebookUrl: 'facebook.com/123456789',
     facebookUsername: 'jessin',
     name: 'Jessin Rodenburg',
     firstName: 'Jessin',
     lastName: 'Rodenburg',
     email: 'jessinrocker@gmail.com',
     status: 1,
     authTicket: '12345678987654321',
     password: 'test',
     createdAt: null,
     updatedAt: null,
     deletedAt: null } }
    */

    getAuthorizationCode: function (authorizationCode) {
        return AuthorizationCode.findOne({
            where : {
                authorizationCode
            },
            include: [User, Client ],
            underscored: true
        }).then(codeModel => 
            codeModel.toJSON()
        ).then(res => {
            res.Client.id = "" + res.Client.id;
            console.log(res);

            return  {
                code : authorizationCode,
                expiresAt : res.expiresAt,
                redirectUri : res.redirectUri,
                scope: res.scope,
                client : res.Client,
                user : res.User,
                grant: res.client.grants
            }

        }).catch(err => {
            console.log("getAuthorizationCode error: ", err);
        })
    },

    getClientById: id => {
        return Client.findOne({
            where : {
                id
            },
            fields : ['id', 'grants'],
        })
        .then(client => client.toJSON())
    },

    getAuthorizationCodeByUserAndClient: function (user, client) {
        return AuthorizationCode.findOne({
            where : {
                client, 
                user
            }
        })
    },

    getUser: function (email, password) { 
        return User.findOne({
            where: { 
                email,
                password
            },
            fields : ['email', 'id', 'name', 'facebookId', 'facebookUrl']
        })
        .then(user => user.toJSON());
    },



    saveToken: (token, client, user) => {
        return Token.create({
            accessToken : token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken : token.refreshToken,
            refreshTokenExpiresOn : token.refreshTokenExpiresOn,
            client: client.id,
            user: user.id,
            scope : token.scope
        }).then(res => {
            let token = {
                accessToken : res.accessToken,
                accessTokenExpiresAt : res.accessTokenExpiresAt,
                refreshToken : res.refreshToken,
                refreshTokenExpiresAt : res.refreshTokenExpiresOn,
                scope : res.scope,
                client,
                user
            }
            console.log(token);
            return token;
        }).catch( err => {
            console.log("saveToken err: ", err);
        })

    },

    getRefreshToken : bearerToken => { 
        return Token.findOne({
            where: {
                refreshToken : bearerToken
            }
        })
    },

    revokeToken: token => {
        console.log(token);
        Token.destroy({
            where: {
                accessToken : token
            }
        })
    },


    saveAuthorizationCode: (code, client, user) => {
        console.log(code);
        return AuthorizationCode.create({
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirect_uri,
            scope: code.scope + "",
            client: client,
            user: user
        })
        .then( () => {
            return code;
        })
        .catch(err => {
            console.log("saveAuthorizationCode error: ", err)
        });
    },
    
    getUserFromToken: accessToken => {
         /* This is where you select the token from the database where the code matches */
         return Token.findOne({
            where : {
                accessToken : accessToken
            },
            include: [ {
                model : User ,
                attributes: ['id', 'email', 'name', 'firstName', 'lastName', 'status', 'facebookId', 'facebookUrl', 'facebookUsername']
            }, Client ]
        }).then( token => token.toJSON() )
        .then( res => {
            console.log("\n=======================================\n getAccessToken")
            console.log(res);
            delete res.User.password;
            delete res.User.authTicket;
            return {
                ...res.User,
            }
        })
        .catch(er => {
            console.log("accessToken error: " + er)
        }) 
    },

    revokeAuthorizationCode: authorizationCode => {
        console.log(authorizationCode);
        return AuthorizationCode.destroy({
            where: {
                authorizationCode : authorizationCode.code
            }
        })
    },

    getUserFromClient: client => {
        let options = {
            where : {
                id: client.id,
            },
            include: [User],
        }
        if(client.clientSecret) options.where.clientSecret = client.clientSecret
        
        return Client.findOne(options)
            .then(client => client.user.toJSON())
            .catch(err => console.log("getUserFromClient error", err) );
    },

    validateScope : (user, client, scope) => {
        
        console.log("\n================================\n validateScope was called");
        console.log(user, client, scope)
        if (!scope.split(',').every(s => VALID_SCOPES.indexOf(s) >= 0)) {
            return false;
        }
        return scope;
    },

    verifyScope: (token, scope) => {
        if(!token.scope) {
            return false;
        }
        console.log("\n=====================================\n verifyScope was called");
        console.log(scope, token);
        
        let requestedScopes = scope.split(' ');
        let authorizedScopes = token.scope.split(',');
        return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    }
    
    
}
