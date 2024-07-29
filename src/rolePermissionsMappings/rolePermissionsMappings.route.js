const express = require("express");
const rolepermissionsmappingRouter = express.Router();
const rolepermissionsmappingController = require("./rolePermissionsMappings.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

// Define routes for role-permissions mappings and apply middlewares as needed
rolepermissionsmappingRouter.get(
  "/role-permissions-mappings",
  authentication,

  rolepermissionsmappingController.getAll
);

rolepermissionsmappingRouter.get(
  "/role-permissions-mappings/:id",
  authentication,

  rolepermissionsmappingController.getRolesPermissions
);

rolepermissionsmappingRouter.post(
  "/role-permissions-mapping",
  authentication,
  rolepermissionsmappingController.create
);

rolepermissionsmappingRouter.delete(
  "/role-permissions-mappings/:id",
  authentication,

  rolepermissionsmappingController.delete
);

module.exports = rolepermissionsmappingRouter;
