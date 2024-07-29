const express = require("express");
const roleRouter = express.Router();
const roleController = require("./roles.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
  priorityGetFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

roleRouter.get(
  "/roles",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  priorityGetFilter(),
  roleController.getAll
);
roleRouter.get(
  "/roles/:id",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  roleController.getByIdWithPermissions
);
roleRouter.post(
  "/role",
  authentication,
  authorization(PermissionCodes.CREATE_ROLE_PERMISSION),
  createdUpdatedBy("create"),
  roleController.createWithPermissions
);
roleRouter.put(
  "/roles/:id",
  authentication,
  authorization(PermissionCodes.UPDATE_ROLE_PERMISSION),
  createdUpdatedBy("update"),
  roleController.update
);
roleRouter.put(
  "/role-permissions-mappings/:id",
  authentication,
  authorization(PermissionCodes.UPDATE_ROLE_PERMISSION),
  createdUpdatedBy("update"),
  roleController.updateWithPermissions
);
roleRouter.delete(
  "/roles/:id",
  authentication,
  authorization(PermissionCodes.DELETE_ROLE_PERMISSION),
  roleController.delete
);

module.exports = roleRouter;
