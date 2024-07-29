const mongoose = require("mongoose");
const User = require("./users.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const UserService = require("./users.service");
const {
  RolepermissionsmappingService,
  Rolepermissionsmapping,
} = require("../rolePermissionsMappings");

const rolepermissionsmappingService = new RolepermissionsmappingService(
  Rolepermissionsmapping
);
const userService = new UserService(User);

class userController extends Controller {
  constructor(service, rolepermissionsmappingService) {
    super(service);
    this.rolepermissionsmappingService = rolepermissionsmappingService;
  }
  login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter Username and password.", 400));
    }
    const user = await this.service.login(email, password);
    if (!user) {
      return next(new ErrorHandler("Invalid username or password!", 401));
    }
    const token = user.getJWTToken();
    const { items } = await this.rolepermissionsmappingService.getMyPermissions(
      user.role
    );
    new responseHandler(
      { user, token, permissions: items },
      "Log in Successfull!",
      200
    ).sendResponse(res);
  });
  getAll = catchAsyncError(async (req, res, next) => {
    req.query.populate = [{ field: "role" }];
    const items = await this.service.getAll(req.query);
    if (!items) {
      return next(new ErrorHandler("No Users added", 404));
    }
    new responseHandler(items, "Fetched Successfully!", 200).sendResponse(res);
  });

  getById = catchAsyncError(async (req, res, next) => {
    const populate = [];
    req.query?.view === "true" ? populate.push({ field: "role" }) : null;
    const item = await this.service.getById(req.params.id, populate);
    if (!item) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    new responseHandler(item, "Fetched Successfully!", 200).sendResponse(res);
  });
}

module.exports = new userController(userService, rolepermissionsmappingService);
