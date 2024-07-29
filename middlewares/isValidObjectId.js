const mongoose = require("mongoose");

// Middleware function to check if a string is a valid Mongoose ObjectId
function isValidObjectIdMiddleware(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Item not found", 404));
  }

  // If the ID is valid, continue with the next middleware or route handler
  next();
}

module.exports = isValidObjectIdMiddleware;
