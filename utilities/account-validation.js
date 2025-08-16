/*  *******************************
* required resource
* ********************************* */
const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Registration Data Validation Rules  - W04
* ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database - W04
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      page: "account",
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ***************************
 * Login Data Validation Rules - W04
 * ************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
  ]
}

/* ***************************
 * Check login data and return errors or next()  - - W04
 * ************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  //let errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: null,
      //account_email,
      page: "account",
      layout: "./layouts/layout"
      })    
  }
  next()
}


/* ***************************
 * Update account Rules- - W05
 * ************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email)
        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already in use.")
        }
      })
  ]
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      }).withMessage("Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.")
  ]
}


// Check update data
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account Info",
      nav,
      errors: errors.array(),
      message: null,
      account: { account_firstname, account_lastname, account_email, account_id },
      layout: "./layouts/layout"
    });
  }

  next();
};

// Check password data
validate.checkPasswordData = async (req, res, next) => {
  const { account_id, account_password } = req.body;
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    const account = await require("../models/account-model").getAccountById(account_id);
    return res.render("account/update-account", {
      title: "Update Account Info",
      nav,
      message: null,
      errors: errors.array(),
      account,
      layout: "./layouts/layout"
    });
  }

  next();
};


module.exports = validate
