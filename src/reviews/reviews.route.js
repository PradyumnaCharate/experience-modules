const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("./reviews.controller");
const { authentication, authorization } = require("../../middlewares/auth");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

reviewRouter.get(
  "/reviews",
  authentication,
  authorization(PermissionCodes.READ_REVIEW_PERMISSION),
  reviewController.getAll
);
reviewRouter.get(
  "/products/:id/reviews",
  authentication,
  authorization(PermissionCodes.READ_REVIEW_PERMISSION),
  reviewController.getReviewsByProduct
);
reviewRouter.get(
  "/reviews/:id",
  authentication,
  authorization(PermissionCodes.READ_REVIEW_PERMISSION),
  reviewController.getById
);
reviewRouter.post(
  "/review",
  authentication,
  authorization(PermissionCodes.CREATE_REVIEW_PERMISSION),
  reviewController.create
);
reviewRouter.put(
  "/reviews/:id",
  authentication,
  authorization(PermissionCodes.UPDATE_REVIEW_PERMISSION),
  reviewController.update
);
reviewRouter.delete(
  "/reviews/:id",
  authentication,
  authorization(PermissionCodes.DELETE_REVIEW_PERMISSION),
  reviewController.delete
);

module.exports = reviewRouter;
