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
    const classificationSelect = await utilities.buildClassificationList() // W05 - classification sekect code added
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
      classificationSelect, 
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
      message: null,
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

/* ***************************
 *  Return Inventory by Classification As JSON - W05
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  if (invData[0] && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const data = await invModel.getInventoryById(inv_id)

    if (!data) {
      throw new Error("Inventory item not found")
    }

    res.render("inventory/edit-inventory", {
      title: `Edit ${data.inv_make} ${data.inv_model}`,
      nav,
      item: data,
      errors: null,
      message: null,
      page: "inventory", 
      layout: "./layouts/layout"
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Edit Inventory View - W05
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    
    // Get the inventory item data from the model
    const itemData = await invModel.getInventoryById(inv_id)
    
    // Build the classification select list with the correct option selected
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    
    // Create a name string for use in the page title
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    // Render the edit view and pass in all item data
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      message: req.flash("notice"),
      errors: null,
      //message: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data - W05
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    let {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    //convert (Coerce) IDs to integers to avoid SQL errors - w05
    inv_id = parseInt(inv_id, 10);
    classification_id = parseInt(
      Array.isArray(classification_id) ? classification_id[0] : classification_id,
      10
    );
    
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      return res.redirect("/inv/");
    } 

    // On failure
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    return res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect,
      errors: null,
      message: req.flash("notice"),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      page: "inventory",
      layout: "./layouts/layout"
    });
  } catch (error) {
    next(error);
  }
};


module.exports = invCont