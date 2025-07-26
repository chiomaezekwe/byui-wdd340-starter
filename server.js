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

app.use(express.static("public"))  /* added this line*/

// Inventory Routes
app.use("/inv", inventoryRoute) /* added this line */

// Index route
//app.get("/", (req, res) => {res.render("index", {title: "Home Page", page: "HOME"})
//});

app.get("/", (baseController.buildHome));


// CSE Motor route
app.get("/", (req, res) => {res.render("index", {title: "Home Page", page: "CSE"})
});

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
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
