
const Review = require('./reviews.model');
const reviewController = require('./reviews.controller');
const reviewRouter = require('./reviews.route');
const ReviewService = require("./reviews.service")

module.exports = {
  Review,
  reviewController,
  reviewRouter,
  ReviewService
};
