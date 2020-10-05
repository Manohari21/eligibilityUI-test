const express = require("express");
let router = express.Router();
const axios = require("axios").default;
const url = require("url");
//const date = require("date");


const { POLICY_SERVICE_URL, ENROLLMENT_SERVICE_URL } = require("../helpers/constants");
const logger = require("../helpers/logger");
const { format } = require("path");



router.get("/", function (req, res, next) {
    // Request policy data from Spring
    logger.debug("Requested enrollment page");
    return axios.get(POLICY_SERVICE_URL)
        .then(function (response) {
            logger.info("Requesting policy information from url: " + POLICY_SERVICE_URL);
            let data = {};
            data.policies = [];
            for (let item of response.data) {
                let value = {};
                value.policyName = item.policyName;
                value.policyId = item.policyId;
                data.policies.push(value);
            }
            // Extract success information from the query
            data.enrollMessage = req.query.success ? req.query.success : "";
            data.failedEnrollMessage = req.query.failure ? req.query.failure : "";
            logger.debug("Response information");
            logger.debug(response);
            logger.debug("Enrollment page rendering");
            logger.debug(data);
            return res.render("enrollment/index.ejs", { data: data });
        });
});
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}
function getSubscriber(req, allBenefits, dependents) {
    let name = {
        firstName: req.body.firstname,
        lastName: req.body.lastname
    };
    var dateOfBirth = formatDate(req.body.dateofbirth);
   
    var address = {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
    };
    logger.info(address.city);
    let benefits = extractRelevantBenefits(formatArray(req.body.policy), formatArray(allBenefits));
    return {
        name: name,
        address: address,
        dateOfBirth: dateOfBirth,
        benefits: formatArray(benefits),
        dependents: formatArray(dependents)
    };
}

function formatArray(object) {
    return Array.isArray(object) ? object : [object];
}

function getDependents(req, benefits) {
    let dependents = JSON.parse(req.body.dependents);
    let result = [];
    for (let dependent of dependents) {
        let dependentName = {
            firstName: dependent.dependentfirstname,
            lastName: dependent.dependentlastname
        };
        let dependentAddress = {
            street: dependent.dependentstreet,
            city: dependent.dependentcity,
            state: dependent.dependentstate,
            country: dependent.dependentcountry
        };
        let dependentRelationship = dependent.dependentrelationship;
        let selectedPolicies = extractRelevantBenefits(formatArray(dependent.dependentpolicy), benefits);
        let newDependent = {
            dependentName: dependentName,
            dependentRelation: dependentRelationship,
            dependentAddress: dependentAddress,
            dependentDateOfBirth: formatDate(dependent.dependentdateofbirth),
            dependentBenefits: selectedPolicies
        }
        result.push(newDependent);
    }
    return result;
}

function extractRelevantBenefits(selectedBenefits, allBenefits) {
    // Filter allBenefits based on IDs returned from selectedBenefits
    // [1] = selected, allBenefits = [{policyId: 1, policyName: "1"}, {polciyId: 2, policyName: "2"}]
    // Returns => [{policyId: 1, policyName: "1"}]
    let newBenefits = allBenefits.filter(benefit => {
        if (selectedBenefits.includes(benefit.policyId)) {
            benefit.currentEligibleAmount = benefit.claimableAmount;
            benefit.totalEligibleAmount = benefit.claimableAmount;
            benefit.claimedAmount = 0;
            return true;
        }
        return false;
    });
    return newBenefits;
}

router.post("/", function (req, res, next) {
    logger.info("Requesting Policies from: " + POLICY_SERVICE_URL);
    return axios.get(POLICY_SERVICE_URL).then(function (response) {
        // Extract the selected policy information

        let dependents = getDependents(req, response.data);
        let subscribers = getSubscriber(req, response.data, dependents);
        var accesstoken='Bearer'+" "+req.session.token;
        var header= {
            'Content-Type': 'application/json',
            'Authorization': accesstoken
        };
        logger.info(subscribers);
        logger.info("Creating subscriber with ID: " + subscribers.subscriberId);
        logger.info("Endpoint: " + ENROLLMENT_SERVICE_URL);
        return axios({
            method: 'POST',
            url: ENROLLMENT_SERVICE_URL,
            data: subscribers,headers:header
        }).then((enrollmentResponse) => {
            logger.info("Response status: " + enrollmentResponse.status);
            let message = enrollmentResponse.data ? "Registration Successful" : "Registration Failure";
            let redirectUrl = url.format({
                pathname: "/enrollment",
                query: {
                    success: message
                }
            });
            return res.redirect(redirectUrl);
        }).catch((error) => {
            logger.error(error);
			let statusCode = error.response.status;
			logger.error(statusCode);
			if(statusCode==401){
				return res.redirect(getEnrollmentTokenExpireMessage());
			}
            return res.redirect(getEnrollmentRedirectMessage());
        });

    }).catch(function (getAllPolicyError) {
        logger.error("Unable to fetch all policies:");
        logger.error(getAllPolicyError);
        return res.redirect(getEnrollmentRedirectMessage());
    });
});

function getEnrollmentRedirectMessage(message = "Something went wrong") {
    return url.format({
        pathname: "/enrollment",
        query: {
            failure: message
        }
    });
}

function getEnrollmentTokenExpireMessage(message = "Token expired. pls login again") {
    return url.format({
        pathname: "/enrollment",
        query: {
            failure: message
        }
    });
}
module.exports = router;