const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view with safe validation - W03
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId, 10);
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "404 - No Inventory Found",
        message: `No inventory found for classification ID ${classification_id}`,
        nav,
        page: "error"
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
      page: "inventory"  /* added this line - W03*/
    });
  } catch (err) {
    console.error("Error in buildByClassificationId:", err);
    next(err); // Forwards to global error handler
  }
};


/* ***************************
 * Build detail view for a specific inventory item W03
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryById(invId); // This is declared first

    /* modified this lines 48 - 57 W03 */
    if (!vehicle) {
      const nav = await utilities.getNav();
      return res.status(404).render("errors/error", {
        title: "404 - Vehicle Not Found",
        message: "The vehicle you're looking for does not exist.",
        nav,
        page: "error"
      });
    }

    const nav = await utilities.getNav();
    const details = await utilities.buildDetailView(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      details,
      page: "inventory",
      vehicle
    });
  } catch (error) {
    console.error("Error in buildByInventoryId:", error);
    next(error);
  }
};
 

module.exports = invCont