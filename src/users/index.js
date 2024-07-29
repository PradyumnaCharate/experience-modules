
const User = require('./users.model');
const userController = require('./users.controller');
const userRouter = require('./users.route');
const UserService = require("./users.service")

module.exports = {
  User,
  userController,
  userRouter,
  UserService
};
