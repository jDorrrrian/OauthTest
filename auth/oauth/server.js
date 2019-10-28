
const OAuth2Server = require('oauth2-server');
const db = require('./db');

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;


const oauth = new OAuth2Server({
    model: db.model,
    grants: ['authorization_code', 'refresh_token'],
    accessTokenLifetime: 60 * 60 * 24 * 7, // 24 hours, or 1 day
    allowEmptyState: true,
    allowExtendedTokenAttributes: true,
});

module.exports.initiate = clientId => {
    
    //starts the flow

    //returns the grants

}

module.exports.getAuthorizationCode = (req, res, next) => {
    console.log(req, res);
}


//

module.exports.checkCredentials = (req, res, next) => {

    let REQ = OAuth2Server.Request(req);
    let RES = OAuth2Server.Response(res);
    // OAuth2Server.authenticate(REQ,RES, {}, ret => {
    //     ret.
    // })
    console.log("req\n==================================================================================== \n", req);
    // console.log("res\n==================================================================================== \n",res);
    return ColabUser.findOne({
        where:{
            email : req.body.email,
            password : req
        }
    }).then(entries => {
        

        if( entries.length =! 1){
            
            const params = [ // Send params back down
                'client_id',
                'redirect_uri',
                'response_type',
                'grant_type',
                'state',
            ]
            .map(a => `${a}=${req.body[a]}`) 
            .join('&');
            return res.redirect(`/oauth?success=false&${params}`);
        }else{
            req.body.user = entries;
            return next();
        }
    }).catch(er => {
        console.log(er);
    });
}

module.exports.authenticate = (req, res, next) => {
    
    
    console.log("\n==============================================================================\n")
    console.log(req);
    
    let model = db.model;
    model.getAccessToken(req.query.bearerToken)
    
    console.log("\n==============================================================================\n")
    console.log(req.query.bearerToken)

    res.status(200).send("test");
}





// module.exports.authenticate = (req, res, next) => {
//     oauth.authenticate({
//         authenticateHandler: {
//             handle: req => {
//                 return req.body.user
//             }
//         }
//     })
// }


/*
module.exports.authenticate = (req, res, next) => {

    DebugControl.log.flow('Initial User Authentication')
    const {username, password} = req.body
    if(username === 'username' && password === 'password') {
      req.body.user = {user: 1}
      return next()
    }
    const params = [ // Send params back down
      'client_id',
      'redirect_uri',
      'response_type',
      'grant_type',
      'state',
    ]
        .map(a => `${a}=${req.body[a]}`)
        .join('&')
    return res.redirect(`/oauth?success=false&${params}`)
    
    }, (req,res, next) => { // sends us to our redirect with an authorization code in our url
        DebugControl.log.flow('Authorization')
        return next()
    }, oauthServer.authorize({
        authenticateHandler: {
      handle: req => {
        DebugControl.log.functionName('Authenticate Handler')
        DebugControl.log.parameters(Object.keys(req.body).map(k => ({name: k, value: req.body[k]})))
        return req.body.user
      }
    }
});

*/