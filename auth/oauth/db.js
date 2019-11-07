const { Token, AuthorizationCode, Client, User } = require('../models');
const crypto = require('crypto');

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
    },

    getAuthorizationCode: function (authorizationCode) {
        return AuthorizationCode.findOne({
            where : {
                authorizationCode
            },
            include: [User, Client]
        }).then(codeModel => 
            codeModel.toJSON()
        ).catch(err => {
            console.log("getAuthorizationCode error: ", err);
        })
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
            }
        })
        .then(user => user.toJSON());
    },

    saveToken: (token, client, user) => {

        Token.create({
            accessToken : token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            client: client.id,
            user: user.id,
            scope : token.scope
        }).then(res => {
            return _.assign(
                {
                    client,
                    user,
                    accessToken : token.accessToken
                }, token
            )
        }).catch( err => {
            console.log("saveToken err: ", err);
        })

    },

    getRefreshToken: token => {
        return Token.findOne({
            where : {
                accessToken : token
            }
        })
    },

    revokeToken: token => {
        Token.destroy({
            where: {
                accessToken : token
            }
        })
    },

    saveAuthorizationCode: (code, client, user) => {
        return AuthorizationCode.create({
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            scope: code.scope,
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

    revokeAuthorizationCode: authorizationCode => {
        return AuthorizationCode.destroy({
            where: {
                authorizationCode
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
        return (user.scope === scope && client.scope === scope && scope !== null) ? scope : false
    },

    verifyscope: (token, scope) => {
        return token.scope === scope
    }
    
    
}
