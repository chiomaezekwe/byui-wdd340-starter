//Required Resources
const jwt = require("jsonwebtoken");

//Middleware function for restricting access based on account roles
module.exports = function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!token) {
    req.flash("notice", "You must be logged in to access this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      // Pass user info to request if needed
      req.account = decoded;
      return next();
    } else {
      req.flash("notice", "Access restricted to employees or administrators.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    req.flash("notice", "Invalid or expired session. Please log in.");
    return res.redirect("/account/login");
  }
};