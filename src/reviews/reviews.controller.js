const mongoose = require("mongoose");
const Review = require("./reviews.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const ReviewService = require("./reviews.service");
const reviewService = new ReviewService(Review);

class reviewController extends Controller {
  constructor(service) {
    super(service);
  }
  create = catchAsyncError(async (req, res, next) => {
    req.body.user = req.userId;
    console.log(req.body);
    const data = await this.service.create(req.body);
    new responseHandler(data, "Log in Successfull!", 200).sendResponse(res);
  });
  getReviewsByProduct = catchAsyncError(async (req, res, next) => {
    const data = await this.service.getReviewsByProduct(req.params.id);
    new responseHandler(data, "Log in Successfull!", 200).sendResponse(res);
  });
}

module.exports = new reviewController(reviewService);
