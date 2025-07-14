const response = require("../utils/response.util"); // adjust the path if needed

const roleChecker = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      return next(); //  Authorized
    }

    //  Not authorized
    return response(
      res,
      "error",
      "Access denied. Admins only.",
      401,
      false,
      "Unauthorized" 
    );
  },

  isProvider: (req, res, next) => {
    if (
      req.user &&
      req.user.role === "serviceProvider" &&
      req.user.status === "approved"
    ) {
      return next(); //  Authorized
    }
    //  Not authorized
    return response(
      res,
      "error",
      req.user?.status !== "approved"
        ? "Your account is not approved yet."
        : "Access denied. Service providers only.",
      401,
      false,
      "Unauthorized"
    );
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === "user") {
      return next(); //  Authorized
    }
    //  Not authorized
    return response(
      res,
      "error",
      "Access denied. Users only.",
      401,
      false,
      "Unauthorized"
    );
  },
};

module.exports = roleChecker;
