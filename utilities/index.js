/* ************************
 * Required Resource
 ************************** */
const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model") /* removed the space */
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  /* Modified these lines (10 - 20) to fit my initial CSS styling W03*/
    let list = '<nav>'
    list += '<a href="/" title="Home page">Home</a>'
    data.rows.forEach((row) => {
    list += '<a href="/inv/type/' + row.classification_id + 
        '" title="See our inventory of ' + row.classification_name + 
        ' vehicles">' + row.classification_name + '</a>'
    })
    list += '</nav>'
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    /* Modified this section lines 28 - 38 to fit my initial CSS styling W03*/
    grid = ''
    data.forEach(vehicle => {
        grid += '<figure>'
        grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
        grid += '</a>'
        grid += '<figcaption>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</figcaption>'
        grid += '<p class="price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
        grid += '</figure>'
    })
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
W03 Added the function to wrap vehicle data in HTML
*************************** */

Util.buildDetailView = function(vehicle) {
  let html = `
    <div class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString('en-US')}</p>
      <p><strong>Year:</strong> ${vehicle.inv_year}</p>
      <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString('en-US')} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    </div>
  `
  return html
}

/* ************************
W04 Added the function to wrap async controller calls to catch errors
*************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/* ************************
W04 - added function to build the classification dropdown list
*************************** */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity - W05
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login - W05
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
 // if (res.locals.loggedin) {
 if (req.session && req.session.account) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

//const jwt = require("jsonwebtoken")

Util.checkLoginStatus = function (req, res, next) {
  const token = req.cookies.jwt

  if (req.session && req.session.account) {
    res.locals.loggedIn = true
    res.locals.clientName = req.session.account.account_firstname
  } else if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.loggedIn = true
      res.locals.clientName = decoded.account_firstname
    } catch (err) {
      res.locals.loggedIn = false
      res.locals.clientName = null
    }
  } else {
    res.locals.loggedIn = false
    res.locals.clientName = null
  }
  next()
}


module.exports = Util