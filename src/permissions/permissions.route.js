const express = require("express");
const permissionRouter = express.Router();
const permissionController = require("./permissions.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");
const rolePermissionsMappingsController = require("../rolePermissionsMappings/rolePermissionsMappings.controller");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

permissionRouter.get(
  "/permissions",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  rolePermissionsMappingsController.getMyPermissions
);

permissionRouter.get(
  "/permissions/:id",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  rolePermissionsMappingsController.getRolesPermissions
);

permissionRouter.post(
  "/permission",
  authentication,
  // authorization(PermissionCodes.READ_ROLE_PERMISSION),
  permissionController.create
);

permissionRouter.put(
  "/permissions/:id",
  authentication,
  permissionController.update
);

permissionRouter.delete(
  "/permissions/:id",
  authentication,
  permissionController.delete
);

module.exports = permissionRouter;
