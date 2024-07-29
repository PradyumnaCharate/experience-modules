const createdUpdatedBy = (action = "create") => {
  return async (req, res, next) => {
    console.log("dsds");
    if (action === "create") {
      req.body.createdBy = req.userId;
    } else if (action === "update") {
      req.body.updatedBy = req.userId;
    }
    next(); // Continue processing the request
  };
};

module.exports = createdUpdatedBy;
