
const Product = require('./products.model');
const productController = require('./products.controller');
const productRouter = require('./products.route');
const ProductService = require("./products.service")

module.exports = {
  Product,
  productController,
  productRouter,
  ProductService
};
