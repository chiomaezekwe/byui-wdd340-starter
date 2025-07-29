// W03: error testing
const express = require("express");
const router = express.Router();
const errorTestController = require("../controllers/errorTestController");

//console.log("triggerError is:", errorTestController.triggerError); /* for debugging */

router.get("/server-error", errorTestController.triggerError)

module.exports = router