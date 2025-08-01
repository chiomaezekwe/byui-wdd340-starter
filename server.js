/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute") /* added this line */
const errorTestRoute = require("./routes/errorTestRoute") /* W03 errorTest */
const errorTestController = require('./controllers/errorTestController') /* W03 errorTest */


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)

app.use(express.static("public"))  /* added this line - W03*/

// Inventory Routes
app.use("/inv", inventoryRoute) /* added this line - W03*/

// errorTest Route - W03
app.use("/", errorTestRoute)  

// Index route
//app.get("/", (req, res) => {res.render("index", {title: "Home Page", page: "HOME"})
//});

//console.log("errorTestController:", errorTestController) /*debugging */
//console.log("triggerError:", errorTestController.triggerError) /* debugging */

app.get("/", (baseController.buildHome));

app.get("/server-error", errorTestController.triggerError);


/*// CSE Motor route
//app.get("/", (req, res) => {res.render("index", {title: "Home Page", page: "CSE"})
//);

// Custom route
app.get("/custom", (req, res) => {res.render("custom", {title: "Custom Page", page: "custom"})
});

// Sedan  route
app.get("/sedan", (req, res) => {res.render("sedan", {title: "Sedan", page: "sedan"})
});

// SUV route
app.get("/suv", (req, res) => {res.render("suv", {title: "Suv Page", page: "suv"})
});

// Truck route
app.get("/truck", (req, res) => {res.render("truck", {title: "Truck Page", page: "truck"})
}) */

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST
//const port = process.env.PORT || 5500; // Fallback if .env is missing

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
  const nav = await require("./utilities").getNav()
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
  const nav = await require("./utilities").getNav()
  res.status(500).render("errors/error", {
    title: "500 - Internal Server Error",
    message: err.message,
    nav,
    page: "error"
  })
});


