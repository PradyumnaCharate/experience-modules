const RolepermissionsmappingService = require("../src/rolePermissionsMappings/rolePermissionsMappings.service");
const UserService = require("../src/users/users.service");
const User = require("../src/users/users.model");
const Rolepermissionsmapping = require("../src/rolePermissionsMappings/rolePermissionsMappings.model");

module.exports = {
  rolepermissionsmappingService: new RolepermissionsmappingService(
    Rolepermissionsmapping
  ),
  userService: new UserService(User),
};
