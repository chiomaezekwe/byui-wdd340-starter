/* ******************************
 *  Required Resources (External)
 * ****************************** */
const express = require("express");
//const regValidate = require("../utilities/account-validation");  /*added this line W04*/
const router = new express.Router();
const utilities = require("../utilities"); 
const accountController = require("../controllers/accountController");
const accountValidation = require("../utilities/account-validation");

console.log(accountController); // See if buildLogin exists

/* **************************************************************
 * GET route for "/account" (when "My Account" link is clicked)
 * *************************************************************** */
//router.get("/", utilities.handleErrors(accountController.buildAccountHome));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//router.get("/login", accountController.buildLogin);

// Route for registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//router.post('/register', utilities.handleErrors(accountController.registerAccount))

// POST handler for registration
/*router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)*/

// Process the registration data
/*router.post(
  "/register",
  regValidate.registrationRules(), // validate rules
  regValidate.checkRegData, //Handles error if found
  utilities.handleErrors(accountController.registerAccount) // controller
) */

router.post(
  "/register",
  accountValidation.registrationRules(), // validate rules
  accountValidation.checkRegData, //Handles error if found
  utilities.handleErrors(accountController.registerAccount) // controller
)

// Process the login attempt - added for successful testing lines 37 - 43 - W04
/*router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)*/

// POST login
router.post(
  "/login",
  accountValidation.loginRules(),
  accountValidation.checkLoginData,
  accountController.accountLogin
)

/* ***************************************
 * Exports the router for use in server.js
 * *************************************** */
module.exports = router;