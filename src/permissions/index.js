
const Permission = require('./permissions.model');
const permissionController = require('./permissions.controller');
const permissionRouter = require('./permissions.route');
const PermissionService = require("./permissions.service")

module.exports = {
  Permission,
  permissionController,
  permissionRouter,
  PermissionService
};
