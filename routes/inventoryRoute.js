// Required Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

//Route to build inventory by Classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Add a new dynamic route for vehicle details W03
router.get("/detail/:invId", invController.buildByInventoryId)

module.exports = router;
