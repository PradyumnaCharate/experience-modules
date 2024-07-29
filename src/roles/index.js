
const Role = require('./roles.model');
const roleController = require('./roles.controller');
const roleRouter = require('./roles.route');
const RoleService = require("./roles.service")

module.exports = {
  Role,
  roleController,
  roleRouter,
  RoleService
};
