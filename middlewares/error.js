const multer = require("multer");
const ErrorHandler = require("../utils/errorHandler");
const logger = require("../logger");

module.exports = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  console.log(err);

  const errors = [];

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      errors.push(new ErrorHandler("File size is too large", 400));
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      errors.push(new ErrorHandler("File limit reached", 400));
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      errors.push(new ErrorHandler("File must be an image", 400));
    }
  }

  if (err.name === "CastError") {
    const msg = `Resource not found. Invalid: ${err.path}`;
    errors.push(new ErrorHandler(msg, 400));
  }

  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach((el) => {
      if (el.name === "CastError") {
        errors.push(new ErrorHandler(`Invalid id of ${el.path}`, 400));
      } else {
        errors.push(new ErrorHandler(el.properties.message, 400));
      }
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    let message;
    switch (field) {
      case "pin":
        message = `Pin already exists.`;
        break;
      case "username":
        console.log(err);
        message = `Username already exists.`;
        break;
      default:
        message = `Duplicate Key Error ${field}.`;
    }
    errors.push(new ErrorHandler(message, 400));
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    errors.push(new ErrorHandler(message, 400));
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`;
    errors.push(new ErrorHandler(message, 400));
  }

  if (errors.length === 0) {
    // If no specific errors matched, use a generic error
    errors.push(new ErrorHandler(err.message, err.statusCode || 500));
  }
  res.status(400).json({
    success: false,
    errors: errors.map((error) => ({
      message: error.message,
      code: error.statusCode,
    })),
  });
};
