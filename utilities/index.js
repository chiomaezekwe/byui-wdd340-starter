const invModel = require("../models/inventory-model") /* removed the space */
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  /* Modified these lines (10 - 20) to fit my initial CSS styling W03*/
    let list = '<nav>'
    list += '<a href="/" title="Home page">Home</a>'
    data.rows.forEach((row) => {
    list += '<a href="/inv/type/' + row.classification_id + 
        '" title="See our inventory of ' + row.classification_name + 
        ' vehicles">' + row.classification_name + '</a>'
    })
    list += '</nav>'
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    /* Modified this section lines 65 - 74 to fit my initial CSS styling W03*/
    grid = ''
    data.forEach(vehicle => {
        grid += '<figure>'
        grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
        grid += '</a>'
        grid += '<figcaption>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</figcaption>'
        grid += '<p class="price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
        grid += '</figure>'
    })
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
W03 Added the function to wrap vehicle data in HTML
*************************** */

Util.buildDetailView = function(vehicle) {
  let html = `
    <div class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString('en-US')}</p>
      <p><strong>Year:</strong> ${vehicle.inv_year}</p>
      <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString('en-US')} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    </div>
  `
  return html
}

/* ************************
W04 Added the function to wrap async controller calls to catch errors
*************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


module.exports = Util