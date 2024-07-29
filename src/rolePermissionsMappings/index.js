
const Rolepermissionsmapping = require('./rolePermissionsMappings.model');
const rolepermissionsmappingController = require('./rolePermissionsMappings.controller');
const rolepermissionsmappingRouter = require('./rolePermissionsMappings.route');
const RolepermissionsmappingService = require("./rolePermissionsMappings.service")

module.exports = {
  Rolepermissionsmapping,
  rolepermissionsmappingController,
  rolepermissionsmappingRouter,
  RolepermissionsmappingService
};
