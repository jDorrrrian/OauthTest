const { Token, AuthorizationCode, Client, User } = require('../models');




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
                    attributes: ['id', 'email', 'username']
                }, Client
            ]
        }).then()
    },
    
    getclient : function (clientId, clientSecret) {
        // query db for details with client
        return Client.findOne({
            where : {
                clientId, 
                clientSecret
            }
        });
    },

    getAuthorizationCodeByToken: function (token) {
        return AuthorizationCode.findOne({
            where : {
                authorizationCode,
                token
            }
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

    getUser: function (id) { 
        return ColabUser.findOne({
            where: {
                id
            }
        })
    },

    saveToken: (token, client, user) => {
        return Token.create({
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            client: client,
            user: user
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
            client: client,
            user: user
        })
    },

    revokeAuthorizationCode: authorizationCode => {
        return AuthorizationCode.destroy({
            where: {
                authorizationCode: authorizationCode
            }
        })
    },

    getUserFromClient: id => {
        return ColabUser.findOne({
            where : {
                id
            }
        })
    },

    verifyscope: (token, scope) => {

    }
    
    
}
