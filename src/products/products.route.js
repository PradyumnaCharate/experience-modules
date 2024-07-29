const express = require("express");
const productRouter = express.Router();
const productController = require("./products.controller");
const { authentication, authorization } = require("../../middlewares/auth");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

productRouter.get(
  "/products",
  authentication,
  authorization(PermissionCodes.READ_PRODUCT_PERMISSION),
  productController.getAll
);
productRouter.post(
  "/products/search",
  authentication,
  authorization(PermissionCodes.READ_PRODUCT_PERMISSION),
  productController.searchProducts
);
productRouter.get(
  "/products/:id",
  authentication,
  authorization(PermissionCodes.READ_PRODUCT_PERMISSION),
  productController.getById
);
productRouter.post(
  "/product",
  authentication,
  authorization(PermissionCodes.CREATE_PRODUCT_PERMISSION),
  productController.create
);
productRouter.put(
  "/products/:id",
  authentication,
  authorization(PermissionCodes.UPDATE_PRODUCT_PERMISSION),
  productController.update
);
productRouter.delete(
  "/products/:id",
  authentication,
  authorization(PermissionCodes.DELETE_PRODUCT_PERMISSION),
  productController.delete
);

module.exports = productRouter;
