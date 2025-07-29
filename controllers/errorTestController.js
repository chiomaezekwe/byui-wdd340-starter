/* W03 error Testing */
//console.log("triggerError function called"); /*for debugging */

function triggerError(req, res, next) {
  throw new Error("This is an intentional error type - 500: server error.");
}

module.exports = {
  triggerError,
};



