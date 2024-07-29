const mongoose = require("mongoose");
const Role = require("./roles.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const {
  RolepermissionsmappingService,
  Rolepermissionsmapping,
} = require("../rolePermissionsMappings");
const RoleService = require("./roles.service");
const roleService = new RoleService(Role);
const rolepermissionsmappingService = new RolepermissionsmappingService(
  Rolepermissionsmapping
);

class roleController extends Controller {
  constructor(service, RolepermissionsmappingService) {
    super(service);
    this.rolepermissionsmappingService = RolepermissionsmappingService;
  }
  createWithPermissions = catchAsyncError(async (req, res, next) => {
    const role = await this.service.create(req.body);
    const rolePermissionMappings = req.body.selectedPermissions.map(
      (permissionId) => ({
        role: role._id,
        permission: permissionId,
      })
    );
    const items = await this.rolepermissionsmappingService.createMany(
      rolePermissionMappings
    );
    new responseHandler(
      { role, items },
      "Added Successfully!",
      200
    ).sendResponse(res);
  });
  getByIdWithPermissions = catchAsyncError(async (req, res, next) => {
    let role = await this.service.getById(req.params.id);
    let items = await this.rolepermissionsmappingService.getMyPermissions(
      req.params.id
    );
    //More Attention needed
    role = { ...role.toObject(), selectedPermissions: items.items };
    new responseHandler(role, "Fetched Successfully!", 200).sendResponse(res);
  });
  updateWithPermissions = catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const role = await this.service.update(req.params.id, req.body);
    await rolepermissionsmappingService.updateRolePermissions(
      req.params.id,
      req.body.selectedPermissions
    );
    new responseHandler(role, "Updated Successfully!", 200).sendResponse(res);
  });
  getAll = catchAsyncError(async (req, res, next) => {
    const items = await this.service.getAll(req.query);
    if (!items) {
      return next(
        new ErrorHandler("No Roles added for this organization", 404)
      );
    }
    new responseHandler(items, "Fetched Successfully!", 200).sendResponse(res);
  });
}

module.exports = new roleController(roleService, rolepermissionsmappingService);
