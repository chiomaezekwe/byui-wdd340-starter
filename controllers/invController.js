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
 
/* ***************************
 *  Build Management view - W04
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const message = req.flash("notice")
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
      errors: null,
      page: "inventory",
      layout: "./layouts/layout"
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Classification - W04
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: null,
    page: "inventory",
    layout: "./layouts/layout"
  });
};

invCont.addNewClassification = async function (req, res) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash("notice", `Successfully added classification: ${classification_name}`);
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add classification.");
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        message: "Failed to add classification.",
        layout: "./layouts/layout"
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: "An error occurred while adding classification.",
      layout: "./layouts/layout"
    });
  }
};

/* ***************************
 *  Build Add Inventory - W04
 * ************************** */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    message: null,
    errors: null,
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
    page: "inventory",
    layout: "./layouts/layout",
  });
};


invCont.addInventory = async (req, res, next) => {
  // Destructure outside try to keep vars in scope in catch block
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;

  let classificationList;

  try {
    classificationList = await utilities.buildClassificationList(classification_id);

    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });

    if (result) {
      req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Failed to add inventory");
    }
  } catch (error) {
    if (!classificationList) {
      classificationList = await utilities.buildClassificationList(classification_id);
    }

    const nav = await utilities.getNav();

    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      message: error.message || "An error occurred.",
      errors: null,
      classificationList,
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "",
      inv_thumbnail: req.body.inv_thumbnail || "",
      inv_price: req.body.inv_price || "",
      inv_year: req.body.inv_year || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id || "",
      page: "inventory",
      layout: "./layouts/layout",
    });
  }
}; 

module.exports = invCont