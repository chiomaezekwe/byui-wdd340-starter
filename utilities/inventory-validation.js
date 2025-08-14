// Required Resources 
const { body, validationResult } = require("express-validator");
const utilities = require("../utilities")

// Classification Validation rules
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed."),
  ]
}

// Check for validation errors
const checkData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = req.nav || []
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      message: null,
      page: "inventory",
      layout: "./layouts/layout",
    })
  }
  next()
}

// Inventory validation rules
const inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Classification is required."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero."),
    body("inv_year").isInt({ min: 1900, max: 2100 }).withMessage("Enter a valid year."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

// Check for validation errors
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);

    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      message: null,
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      page: "inventory",
      layout: "./layouts/layout",
    });
  }
  next();
};

// Check for update validation errors
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);

    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      message: null,
      inv_id: req.body.inv_id,
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      page: "inventory",
      layout: "./layouts/layout",
    });
  }
  next();
};

module.exports = { classificationRules, checkData, inventoryRules, checkInventoryData, checkUpdateData };