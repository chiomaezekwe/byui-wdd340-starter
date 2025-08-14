// Required Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { classificationRules, checkData, inventoryRules, checkInventoryData, checkUpdateData } = require("../utilities/inventory-validation")
//const { inventoryRules, checkInventoryData } = require("../utilities/inventory-validation")

//Route to build inventory by Classification view with validation
//router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/type/:classificationId", async (req, res, next) => {
  try {
    const { classificationId } = req.params;

    // Validate that classificationId is a number
    if (isNaN(Number(classificationId))) {
      const nav = await utilities.getNav();
      return res.status(400).render("errors/error", {
        title: "400 - Invalid Classification ID",
        message: `Invalid classification ID: "${classificationId}". Please enter a valid numeric ID, page does not exist.`,
        nav,
        page: "error"
      });
    }

    // Pass to controller if valid
    await invController.buildByClassificationId(req, res, next);
  } catch (err) {
    next(err); // For global error handler to catch
  }
});

// Add a new dynamic route for vehicle details W03
router.get("/detail/:invId", invController.buildByInventoryId)

// Route to Inventory Management View
router.get("/", invController.buildManagementView)

// Temporary routes (added to handle error 404)
/*router.get("/add-classification", (req, res) => {
  res.send("Add New Classification - Coming Soon")
}); */

/*router.get("/add-inventory", (req, res) => {
  res.send("Add New Inventory - Coming Soon");
});*/

// Route to display form to add new classification
router.get("/add-classification", invController.buildAddClassification);

// Process form submission
router.post("/add-classification",
  classificationRules(), // validation middleware
  checkData, // middleware that checks validation results
  invController.addNewClassification // controller function
);

// Show add inventory form
router.get("/add-inventory", invController.buildAddInventory);

// Process form submission
router.post(
  "/add-inventory",
  inventoryRules(),      // validation middleware
  checkInventoryData,    // validation result handler
  invController.addInventory      // controller logic
);

// Route to get inventory items by classification ID (used by JS)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to deliver the "Edit Inventory Item" view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventoryView)
)

// Route to handle vehicle inventory update
router.post("/update", utilities.handleErrors(invController.updateInventory))


// Update inventory item
router.post(
  "/update",
  inventoryRules(),        // inventory validation Rules
  checkUpdateData,         // checkUpdateData directly
  utilities.handleErrors(invController.updateInventory) // controller function with error handling
)

// Helper to wrap async route handlers with try-catch
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err); // Forward error to global error handler middleware
    }
  };
}

// Delete GET route with error handling, shows the delete confirmation page for a specific inventory item
router.get(
  "/delete/:inv_id",
  asyncHandler(invController.buildDeleteInventoryView)
);

// Delete POST route with error handling, to perform the actual delete operation
router.post(
  "/delete",
  asyncHandler(invController.deleteInventory)
);


module.exports = router;
