
const mongoose = require('mongoose');
const Permission = require('./permissions.model');
const catchAsyncError = require('../../utils/catchAsyncError');
const ErrorHandler = require('../../utils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const Controller = require("../../common/commonController");
const PermissionService = require('./permissions.service');
const permissionService = new PermissionService(
  Permission
);

class permissionController extends Controller {
  constructor(service) {
    super(service);
  }
};

module.exports = new permissionController(permissionService);
