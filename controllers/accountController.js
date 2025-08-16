const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountController = {}

/* ============================
 * Login View
 * ============================ */
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
      page: "account",
      layout: "./layouts/layout"
    })
  } catch (error) {
    next(error)
  }
}

/* ============================
 * Register View
 * ============================ */
accountController.buildRegister = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      message: req.flash("notice"),
      errors: null,
      page: "account",
      account_firstname: null,
      account_lastname: null,
      account_email: null
    })
  } catch (error) {
    next(error)
  }
}

/* ============================
 * Register Account
 * ============================ */
accountController.registerAccount = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        errors: null,
        page: "account",
        layout: "./layouts/layout"
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        message: req.flash("notice"),
        errors: null,
        page: "account",
        account_firstname,
        account_lastname,
        account_email
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ============================
 * Login Handler
 * ============================ */
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

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);

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

    // Generate JWT payload
    const accountPayload = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type
    };

    // Generate JWT and set cookie
    const accessToken = jwt.sign(accountPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000 // 1 hour
    });

    // Set session and redirect
    req.session.account = accountPayload;

    req.session.save(() => {
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
      res.redirect("/account");
    });
  } catch (error) {
    next(error);
  }
};

/*accountController.accountLogin = async (req, res, next) => {
  try {
    const { account_email, account_password } = req.body
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        message: null,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
        page: "account",
        layout: "./layouts/layout"
      })
    }

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
      })
    }

    // Set session
    req.session.account = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type
    }

    // Save session before redirecting
    req.session.save(() => {
    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
    res.redirect("/account")
  })
  } catch (error) {
    next(error)
  }
}*/

/* ============================
 * Account Management View
 * ============================ */
accountController.buildAccountManagement = async (req, res) => {
  const nav = await utilities.getNav()
  const message = req.flash("notice")
  res.render("account/index", {
    title: "Account Management",
    nav,
    message: message.length > 0 ? message[0] : null,
    errors: null,
    page: "account",
    account: req.session.account,
    layout: "./layouts/layout"
  })
}

/* ============================
 * Account Upadte by Roles
 * ============================ */
/*accountController.buildUpdateAccount = async (req, res, next) => {
  const nav = await utilities.getNav()
  const account_Id = req.params.account_Id
  const accountData = await accountModel.getAccountById(accountId)

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account")
  }

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    account: accountData,
    message: null,
    errors: null,
    layout: "./layouts/layout"
  })
} */

/* ============================
 * Account Profile Upadte Management
 * ============================ */

accountController.buildUpdateAccount = async (req, res, next) => {
  const account_id = req.params.account_id
  console.log("Route hit. account_id param:", account_id)
  console.log("Requested account_id:", account_id) // for debugging purposes

  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  console.log("Fetched accountData:", accountData) // for debugging purposes

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account")
  }

  res.render("account/update-account", {
    title: "Update Account Info",
    nav,
    errors: null,
    message: null,
    account: accountData,
    layout: "./layouts/layout"
  })
}


accountController.updateAccount = async (req, res, next) => {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    // refresh session info
    req.session.account.account_firstname = account_firstname
    req.session.account.account_lastname = account_lastname
    req.session.account.account_email = account_email
    return res.redirect("/account")
  } else {
    req.flash("notice", "Account update failed.")
    const account = await accountModel.getAccountById(account_id)
    return res.status(501).render("account/update-account", {
      title: "Update Account Info",
      nav,
      errors: null,
      message: "Update failed.",
      account,
      layout: "./layouts/layout"
    })
  }
}

accountController.changePassword = async (req, res, next) => {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)
  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (result) {
    req.flash("notice", "Password updated successfully.")
    return res.redirect("/account")
  } else {
    req.flash("notice", "Password update failed.")
    const account = await accountModel.getAccountById(account_id)
    return res.status(501).render("account/update-account", {
      title: "Update Account Info",
      nav,
      message: "Password update failed.",
      errors: null,
      account,
      layout: "./layouts/layout"
    })
  }
}

/* ============================
 * Logout
 * ============================ */
accountController.logout = (req, res) => {
  res.clearCookie("jwt")
  req.session.destroy(() => {
    res.redirect("/")
  })
}


module.exports = accountController
