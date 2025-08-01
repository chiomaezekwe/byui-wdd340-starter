// Required Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

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

module.exports = router;
