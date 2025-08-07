const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
 /* req.flash("notice", "This is a flash message.") */ /* Create flash message - W04 */
  res.render("index", {title: "Home", nav,page: "home"})  /*added page: "home" to fit my initial styling*/
}
 
module.exports = baseController



