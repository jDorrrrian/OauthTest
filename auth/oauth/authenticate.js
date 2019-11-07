let oauthServer = require('oauth2-server');
let Request = oauthServer.Request;
let Response = oauthServer.Response;
let oauth = require('./oauth')


module.exports = (options) => {
    let options = options || {}
    return (req, res, next) => {
        let request = new Request({
            headers: {authorization: req.headers.authorization},
            method: req.method,
            query: req.query,
            body: req.body      
        });
        let response = new Response(res);
        
        oauth.authenticate(request, response,options)
            .then(function (token) {
                req.user = token
                next()
            })
            .catch(function (err) {
                res.status(err.code || 500).json(err)
            });
    
    }
}