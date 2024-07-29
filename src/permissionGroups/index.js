
const Permissiongroup = require('./permissionGroups.model');
const permissiongroupController = require('./permissionGroups.controller');
const permissiongroupRouter = require('./permissionGroups.route');
const PermissiongroupService = require("./permissionGroups.service")

module.exports = {
  Permissiongroup,
  permissiongroupController,
  permissiongroupRouter,
  PermissiongroupService
};
