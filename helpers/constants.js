const ELIGIBILITY_SERVICE_URL = process.env.ELIGIBILITY_SERVICE_URL || "http://localhost:8210/getBenefits";
const POLICY_SERVICE_URL = process.env.POLICY_SERVICE_URL || "http://localhost:8210/getAllPolicies";
const POLICY_DETAILS_URL = process.env.POLICY_DETAILS_URL || "http://localhost:8210/getPolicyDetails";
const ENROLLMENT_SERVICE_URL = process.env.ENROLLMENT_SERVICE_URL || "http://localhost:8210/enrollment";
const LOGIN_SERVICE_URL = process.env.LOGIN_SERVICE_URL || "http://localhost:8210/getUser";
const OAUTH_SERVICE_URL = process.env.OAUTH_SERVICE_URL || "http://localhost:8210/oauth/token";
const TEMPORARY_PSWD_URL = process.env.TEMPORARY_PSWD_URL || "http://localhost:8210/sendTemporaryPassword";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const SECRET =process.env.SECRET || "secret";
const token = process.env.token || "token";
const expires = process.env.token || "expires";
const TOKEN_SERVICE_URL = process.env.TOKEN_SERVICE_URL || "http://localhost:8210/tokens";

module.exports = { SECRET,ELIGIBILITY_SERVICE_URL, POLICY_SERVICE_URL, POLICY_DETAILS_URL, ENROLLMENT_SERVICE_URL,LOGIN_SERVICE_URL,OAUTH_SERVICE_URL,TOKEN_SERVICE_URL,token,expires, LOG_LEVEL,TEMPORARY_PSWD_URL }
