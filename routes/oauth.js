var express = require('express');
var router = express.Router();
var axios = require("axios");
var querystring = require('querystring');
const { OAUTH_SERVICE_URL } = require("../helpers/constants");
const { TOKEN_SERVICE_URL } = require("../helpers/constants");
const logger = require("../helpers/logger");
const { isNullOrUndefined } = require('util');
let token1 = '';
var token = '';


router.post('/', (req, res) => {
    logger.info("generateToken page requested");
    var errormessage = 'Invalid Username/password';
    var url = OAUTH_SERVICE_URL;
    var url1 = TOKEN_SERVICE_URL;
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZWxpZ2liaWxpdHlkYjpzZWNyZXQ='
    };
    var header1 = {
        'Content-Type': 'application/json'
    }
    console.log(url + header);
    axios.post(url,
        querystring.stringify({
            'grant_type': 'password', username: req.body.username
            , password: req.body.username
        })
        , { headers: header },
    ).then(function (response) {
        const data = response.data;
        console.log("token" + data.access_token + "times" + data.expires_in);
        token = data.access_token;
        token1 = data.access_token;
        req.session.token = data.access_token;
        req.session.username = req.body.username;
        let tokendetails = {
            "name": req.session.username,
            "token": token1
        }
        if (token != null) {
            console.log("insert the token to db" + token1);
            axios.post(url1, tokendetails, { headers: header1 },).then((response) => {
                logger.info("Response status: " + response.status);
            });
            res.redirect('/home');
        }
        else {
            logger.info("Unable to log in username: " + data.name);
            res.render('login.ejs', { errormessage: errormessage });
        }
    })
});

module.exports = router;
