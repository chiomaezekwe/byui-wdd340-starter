/* ******************************
 *  Required Resources (External)
 * ****************************** */
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const accountValidation = require("../utilities/account-validation");

/* **************************************************************
 * GET route to show login view
 * *************************************************************** */
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

/* **************************************************************
 * GET route to show registration view
 * *************************************************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* **************************************************************
 * POST route to handle registration
 * *************************************************************** */
router.post(
  "/register",
  accountValidation.registrationRules(),
  accountValidation.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* **************************************************************
 * POST route to handle login
 * *************************************************************** */
router.post(
  "/login",
  accountValidation.loginRules(),
  accountValidation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* **************************************************************
 * GET route for Account Management Dashboard (Protected)
 * *************************************************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

/* **************************************************************
 * GET route to handle based role access
 * *************************************************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* **************************************************************
 * GET route to logout
 * *************************************************************** */
router.get("/logout", accountController.logout);

// Update Account Profile Route


// POST account info update
router.post("/update",
  accountValidation.updateAccountRules(),
  accountValidation.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// POST password change
router.post("/update-password",
  accountValidation.passwordRules(),
  accountValidation.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)


/* ***************************************
 * Export the router
 * *************************************** */
module.exports = router;
