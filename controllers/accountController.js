/* ******************
 * Required Resource
 * ****************** */
const utilities = require("../utilities");
const accountModel = require("../models/account-model")  /* added this line  - W04 */

const accountController = {};

/* ***************************
 * Login view  - W04
 * ************************** */
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render('account/login', {
      title: "Login",
      nav, //nav display
      //nav:"", // blank nav display
      message: null,
      errors: null, // Added this line - W04
      page: "account",
      layout: "./layouts/layout"  // enforce use of layout
    });
  } catch (error) {
    next(error);
  }
};

accountController.buildRegister = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();

    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // Added this line - W04
      message: null,
      page: "account",
      account_firstname: null,
      account_lastname: null,
      account_email: null,
    });
  } catch (error) {
    next(error);
  }
};


/* ****************************************
*  Process Registration  - W04
* *************************************** */
accountController.registerAccount = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        message: null,
        errors: null, // Added this line - W04
        page: "account",
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Register",
        nav,
        message: "Registration failed",
        errors: null, // Added this line - W04
        page: "account",
        account_firstname,
        account_lastname,
        account_email
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;
