/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
require("dotenv").config(); 
const express = require("express")
//const env = require("dotenv").config()
//console.log("DATABASE_URL from .env:", process.env.DATABASE_URL)
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute") /* added this line */
const errorTestRoute = require("./routes/errorTestRoute") /* W03 errorTest */
const errorTestController = require('./controllers/errorTestController') /* W03 errorTest */
const accountRouter = require("./routes/accountRoute") /* added this line - W04 */
const bodyParser = require("body-parser")  /* added this line - W04 */
const cookieParser = require("cookie-parser") /*added this line to require the cookie-parser - w05 */
const utilities = require("./utilities/")

const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET || "fallback-secret-key"; 
const utils = require("./utilities")

/*For Session package and DB connection - W04*/
const session = require("express-session")
const pool = require('./database/')
const flash = require("connect-flash")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("layout", "./layouts/layout") // not at views root
app.use(expressLayouts)


/* ***********************
 * Middleware  - W04 - express-session setup
 * ************************/
//app.use("/account", require("./routes/accountRoute"))
app.use(express.urlencoded({ extended: true })) // for form submissions (application/x-www-form-urlencoded)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser()) // for the cookieParser to be implemented throughout the project - w04

app.use(utilities.checkJWTToken) // added this line - W05

/* Static Files */
app.use(express.static("public"))  /* added this line - W03*/

/* Session and Flash Setup */
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware  - W04
app.use(require('connect-flash')())

app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Make flash messages available to all views //14082025
app.use((req, res, next) => {
  res.locals.message = req.flash("notice");
  next();
});

/* W05 check login status on all request*/

app.use(utils.checkLoginStatus)
app.use(require("./utilities").checkLoginStatus)


const accountRoutes = require('./routes/accountRoute');
app.use('/account', accountRoutes);


// Middleware to check JWT and set login info
app.use((req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey); // Verify token using secret
      res.locals.loggedIn = true;
      res.locals.clientName = decoded.first_name; // Customize this based on your payload
    } catch (err) {
      // Token is invalid or expired
      res.locals.loggedIn = false;
      res.locals.clientName = null;
    }
  } else {
    // No token found
    res.locals.loggedIn = false;
    res.locals.clientName = null;
  }
  
  next();
});


/* ***********************
 * Create Routes  after middleware is in place
 *************************/
app.use(static)

// Account Router
app.use("/account", accountRouter) /* added this line - W04*/

// Inventory Routes
app.use("/inv", inventoryRoute) /* added this line - W03*/

// errorTest Route - W03
app.use("/", errorTestRoute)  

// Index route
app.get("/", (baseController.buildHome))

app.get("/server-error", errorTestController.triggerError)


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500; // Fallback if .env is missing
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
console.log("PORT from env:", port); /*for debugging */
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* Applying the error handling middleware - W03 */

// Catch 404 errors (Page Not Found)
app.use(async (req, res, next) => {
  //const nav = await require("./utilities").getNav()
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Oops! Page not found.",
    nav,
    page: "error"
  })
})

// Catch 500 error - Server Errors
app.use(async (err, req, res, next) => {
  console.error("Middleware caught error:", err.message)
  //const nav = await require("./utilities").getNav()
  const nav = await utilities.getNav()
  res.status(500).render("errors/error", {
    title: "500 - Internal Server Error",
    message: err.message,
    nav,
    page: "error"
  })
})



