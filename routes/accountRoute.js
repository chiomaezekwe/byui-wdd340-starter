/* ******************************
 *  Required Resources (External)
 * ****************************** */
const express = require("express");
const regValidate = require('../utilities/account-validation');  /*added this line W04*/
const router = new express.Router();
const utilities = require("../utilities"); 
const accountController = require("../controllers/accountController");

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
router.post(
  "/register",
  regValidate.registationRules(), // validate rules
  regValidate.checkRegData, //Handles error if found
  utilities.handleErrors(accountController.registerAccount) // controller
)


/* ***************************************
 * Exports the router for use in server.js
 * *************************************** */
module.exports = router;