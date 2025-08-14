/* ******************
 * Required Resource
 * ****************** */
const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = require("../utilities");
const accountModel = require("../models/account-model")  /* added this line  - W04 */
const bcrypt = require("bcryptjs") /* added this line  - W04 */

const accountController = {};

/* ***************************
 * Login view  - W04
 * ************************** */
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("notice"); // get the flash message
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

    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        message: null,
        errors: null, // Added this line - W04
        page: "account",
        account_firstname,
        account_lastname,
        account_email
      });
    }

    // Store the hashed password instead of the plain one
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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

accountController.accountLogin = async (req, res, next) => {
  try {
    const { account_email, account_password } = req.body;
    const nav = await utilities.getNav();

    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        message: null,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
        page: "account",
        layout: "./layouts/layout"
      });
    }

    // If you're not using hashed passwords yet, use this:
    //const passwordMatch = account_password === accountData.account_password

    // If you switch to hashed passwords later, use this instead:
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)

    if (!passwordMatch) {
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        message: null,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
        page: "account",
        layout: "./layouts/layout"
      });
    }

    // Login successful - set session
    req.session.account = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
    };

    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
    res.redirect("/account");

  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process login request - w05
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
};

/* ****************************************
 *  Build Account Management View - W05
 * ************************************ */
accountController.accountLogin = async function (req, res) {
//async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const message = req.flash("message")
  res.render("account/index", {
    title: "Account Management",
    nav,
    message: message.length > 0 ? message[0] : null,
    errors: null,
    page: "account",
    layout: "./layouts/layout"
  })
};

module.exports = accountController;
