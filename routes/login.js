var express = require('express');
var router = express.Router();
var axios = require("axios");
const { LOGIN_SERVICE_URL } = require("../helpers/constants");
const { TEMPORARY_PSWD_URL } = require("../helpers/constants");

const logger = require("../helpers/logger");


router.get('/', (req, res) => {
    logger.info("Login Page requested");
    res.render('login.ejs');
});
router.post('/sendTemporaryPassword', (req, res) => {
    logger.info("sendTemporaryPassword page is started" );
    let url = TEMPORARY_PSWD_URL;
    var userData = {
        userName: req.body.name,
        email: req.body.email
    }
    logger.info("URL => "+url);
    logger.info("user Data => "+userData);
    axios({
        method: 'post',
        url: url,
        data: userData,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then((response) => {
        logger.info("response is Success  ");
        if (response.data.status) {
            logger.info(response.data.data);
            res.render('login.ejs', { errormessage: response.data.data });
        }else if(!response.data.status){
            logger.info(response.data.data);
            res.render('login.ejs', { errormessage: response.data.data });
        }
    }, (error) => {
        logger.error("error => "+error);
    });
})

module.exports = router;
