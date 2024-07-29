const mongoose = require("mongoose");
const Product = require("./products.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const ProductService = require("./products.service");
const esClient = require("../../config/esClient");
const productService = new ProductService(Product);

class productController extends Controller {
  constructor(service) {
    super(service);
  }
  searchProducts = catchAsyncError(async (req, res, next) => {
    const { query } = req.body;
    const data = await productService.searchWithPagination({
      index: "products",
      currentPage: req.query?.currentPage || 1,
      resultsPerPage: req.query?.resultsPerPage || 10,
      search: query,
    });

    new responseHandler(data, "Fetched Successfully!", 200).sendResponse(res);
  });
}

module.exports = new productController(productService);
