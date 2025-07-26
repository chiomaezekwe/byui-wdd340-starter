const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav,page: "home"})  /*added page: "home" to fit my initial styling*/
}

module.exports = baseController


