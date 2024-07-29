const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const {
  userService,
  rolepermissionsmappingService,
} = require("../services/dependencyResolver");

const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(
        new ErrorHandler(
          "Unauthorized.Please Send token in request header",
          401
        )
      );
    }
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const user = await userService.getById(userId);
    if (!user) {
      return next(
        new ErrorHandler("Unauthorized.Please Send valid token", 401)
      );
    }

    req.userId = userId;
    req.roleId = user.role;

    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Unauthorized.Please Send valid token", 401));
  }
};

// Define the middleware function
const authorization = (code = 78) => {
  return async (req, res, next) => {
    try {
      const result = await rolepermissionsmappingService.findByRoleAndCode(
        req.roleId,
        code
      );
      if (!result) {
        return next(
          new ErrorHandler(
            "Unauthorized. You do not have sufficient permissions to access this resource",
            401
          )
        );
      }
      req.priority = result.role.priority;
      next();
    } catch (error) {
      return next(
        new ErrorHandler(
          "Unauthorized. You do not have sufficient permissions to access this resource",
          401
        )
      );
    }
  };
};
const levelOnePriorityFilter = async (req, res, next) => {
  if (req.priority > 0 && req.params.id !== req.orgId.toString()) {
    return next(
      new ErrorHandler(
        "Unauthorized. You do not have sufficient permissions to access this resource",
        401
      )
    );
  }
  next();
};

const priorityGetFilter = (self = false) => {
  return async (req, res, next) => {
    if (req.priority > 0 && !self) {
      req.query.filters = [{ field: "organization", value: req.orgId }];
    } else if (req.priority > 0 && self) {
      req.query.filters = [{ field: "_id", value: req.orgId }];
    }
    next();
  };
};

const priorityPostFilter = (self = false) => {
  return async (req, res, next) => {
    if (!self) {
      req.query.filters = [{ field: "organization", value: req.orgId }];
    } else {
      req.query.filters = [{ field: "_id", value: req.orgId }];
    }
  };
};

module.exports = {
  authentication,
  authorization,
  levelOnePriorityFilter,
  priorityGetFilter,
};
