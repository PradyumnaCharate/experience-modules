const express = require("express");
const permissiongroupRouter = express.Router();
const permissiongroupController = require("./permissionGroups.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");

permissiongroupRouter.get(
  "/permission-groups",
  // authentication,
  // authorization(5755),
  permissiongroupController.getAll
);

permissiongroupRouter.get(
  "/permission-groups/:id",
  // authentication,
  // authorization(5767),
  permissiongroupController.getById
);

permissiongroupRouter.post(
  "/permission-group",
  // authentication,
  // authorization(5755),

  // createdUpdatedBy(),
  permissiongroupController.create
);

permissiongroupRouter.put(
  "/permission-groups/:id",
  // authentication,
  // authorization(5650),
  // createdUpdatedBy("update"),
  permissiongroupController.update
);

permissiongroupRouter.delete(
  "/permission-groups/:id",
  // authentication,
  // authorization(5676),
  permissiongroupController.delete
);

module.exports = permissiongroupRouter;
