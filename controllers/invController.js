const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    page: "inventory"  /* added this line */
  })
}


/* ***************************
 * Build detail view for a specific inventory item W03
 * ************************** */
  invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryById(invId) // This is declared first

    if (!vehicle) {
      return res.status(404).send("Vehicle not found")
    }

    const nav = await utilities.getNav()
    const details = await utilities.buildDetailView(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      details,
      page: "inventory",
      vehicle
    })
  } catch (error) {
    console.error("Error in buildByInventoryId:", error)
    next(error)
  }
}

module.exports = invCont