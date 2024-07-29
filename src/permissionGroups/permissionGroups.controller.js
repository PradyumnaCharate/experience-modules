
const mongoose = require('mongoose');
const Permissiongroup = require('./permissionGroups.model');
const catchAsyncError = require('../../utils/catchAsyncError');
const ErrorHandler = require('../../utils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const Controller = require("../../common/commonController");
const PermissiongroupService = require('./permissionGroups.service');
const permissiongroupService = new PermissiongroupService(
  Permissiongroup
);

class permissiongroupController extends Controller {
  constructor(service) {
    super(service);
  }
};

module.exports = new permissiongroupController(permissiongroupService);
