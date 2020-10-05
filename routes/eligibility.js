const express = require("express");
const axios = require("axios").default;
let router = express.Router();
const { ELIGIBILITY_SERVICE_URL } = require("../helpers/constants");
const logger = require("../helpers/logger");

router.get("/", function (req, res, next) {
    return res.render("eligibilityCheck/index.ejs");
});

router.post("/", function (req, res, next) {
    console.log(req.session.token + "**************");
    var accesstoken = 'Bearer' + " " + req.session.token;
    var header11 = {
        'Content-Type': 'application/json',
        'Authorization': accesstoken
    };
    let subscriberId = req.body.subscriberId;
    let policyId = req.body.policyId;
    let dependentId = req.body.dependentId;
    logger.info(`SubscriberID: ${subscriberId}, PolicyID: ${policyId}, DependentID: ${dependentId}`);
    const errorMessage = "Uh-Oh. Something went wrong. Please try again.";
    if (!subscriberId || !policyId || !dependentId) {
        logger.error("Incorrect values received from UI. SubscriberID, PolicyID, DependentID not found.");
        return res.send({ code: 400, message: errorMessage });
    }
    //  return axios.get(ELIGIBILITY_SERVICE_URL, { params: { subscriberId: subscriberId, plan: policyId, uniqueId: dependentId } })
    let url = ELIGIBILITY_SERVICE_URL + `?subscriberId=${req.body.subscriberId}&dependentId=${req.body.dependentId}&policyId=${req.body.policyId}`;
    return axios.get(url,
        { headers: header11 })
        .then(function (success) {
            let isEligible = success.data.eligible;
            let message = isEligible ? `Subscriber: ${success.data.subscriberId} is eligibile` :
                `Subscriber: ${success.data.subscriberId} is not eligibile`;
            logger.info(`Success! Status Message: ${message}`);
            return res.send({ code: success.status, message: message });
        })
        .catch(function (error) {
            logger.error("Received error: " + error);
            logger.debug(error.response);
            if (error.response) {
                let statusCode = error.response.status;
                logger.error(statusCode);
                logger.error(error.response.data);
                if (statusCode >= 400 && statusCode < 500) {
                    // No dependent or subscriber found
                    return res.send({ code: statusCode, message: "Invalid subscriber/dependent ID found. Please check subscriber/dependent ID." });
                }
                return res.send({ code: error.response.status, message: errorMessage });
            }
            return res.send({ code: 500, message: errorMessage })
        });
});

module.exports = router;