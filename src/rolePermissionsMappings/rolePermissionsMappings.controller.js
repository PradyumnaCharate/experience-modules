const mongoose = require("mongoose");
const Rolepermissionsmapping = require("./rolePermissionsMappings.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const RolepermissionsmappingService = require("./rolePermissionsMappings.service");

const rolepermissionsmappingService = new RolepermissionsmappingService(
  Rolepermissionsmapping
);

class rolepermissionsmappingController extends Controller {
  constructor(service) {
    super(service);
  }
  insertMany = catchAsyncError(async (req, res, next) => {
    const { permissions } = req.body;
    const { id } = req.params;
    if (permissions.length <= 0) {
      return next(new ErrorHandler("Please Specify permissions for role", 400));
    }
    const permissionIds = permissions.map((permission) => ({
      role: id,
      permission,
    }));
    await this.service.insertMany(permissionIds);
    new responseHandler(
      { user, token },
      "Added successfully!",
      200
    ).sendResponse(res);
  });
  getMyPermissions = catchAsyncError(async (req, res, next) => {
    const { roleId } = req;

    console.log("role", roleId);
    const items = await this.service.getMyPermissions(roleId, false);
    new responseHandler(items, "Fetched successfully!", 200).sendResponse(res);
  });
  getRolesPermissions = catchAsyncError(async (req, res, next) => {
    const roleId = req.params.id;
    const permissions = await this.service.getMyPermissions(roleId, false);
    new responseHandler(permissions, "Fetched successfully!", 200).sendResponse(
      res
    );
  });
}

module.exports = new rolepermissionsmappingController(
  rolepermissionsmappingService
);
