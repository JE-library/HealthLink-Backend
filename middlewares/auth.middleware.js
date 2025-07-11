const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const ServiceProvider = require("../models/ServiceProvider.js");
const Admin = require("../models/Admin.js");

const protected = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
     

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      } else if (decoded.role === "service provider") {
        req.user = await ServiceProvider.findById(decoded.id).select(
          "-password"
        );
      } else if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        throw new Error("User Role Not Found In Middileware");
      }

      //

      return next();
    } catch (error) {
      console.error("Token error:", error.message);
      return res.status(401).json({
        message: "Not authorized, Expired or Invalid token",
      });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = protected;
