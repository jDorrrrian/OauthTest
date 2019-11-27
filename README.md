**Oauth
I spent a very long time making this, figured someone else might be able to use this.

You should add a private.key and public.key - both RSA keys.

As for the front end: I will make it as well and put it on my GH as well.
But it is fairly simple/
_________________________________________________________________________________________________________________________________________
have one page on the front end: log-in, 

this should be roughly the url: 
> http://localhost:8080/auth/login?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope_split_by_comma}&state=foobar

Have the user log in
store the jwt in a cookie
redirect the user to :

> http://localhost:8080/auth/authorization?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope_split_by_comma}&state=foobar

the action on the authorization button:

` window.location.replace('${data.redirect_uri}?code=${response.data.code}&state=${response.data.state}&client_id=${data.client_id}')`

The user will be redirected to the redirection page of the micro service, the response.data.code is most important. It's the authorization token (not access token!)

At the redirection page, the microservice should use a post with the information it has to auth/token. The server will return an access token. This access token can be used to authorize requests. Try this in postman!

`
ex: 
{
    client_id:0
    code:41c6abeaa0da4c509a4159c5652eb4565d88a1172575824ca1db319d013169d5
    client_secret:12345678900987654321
    grant_type:authorization_code
    redirectUri:http://localhost:3030/redirection/0/w09u340aw
    scope:profile
}

`

This project was made at work, as research. My laptop was previously owned by an Eduardo, so now all of my commits are on the wrong name and I have not changed this. 