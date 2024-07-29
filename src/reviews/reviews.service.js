const { default: mongoose } = require("mongoose");
const Service = require("../../common/CommonService");
class ReviewService extends Service {
  constructor(model) {
    super(model);
  }
  async getReviewsByProduct(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }
    const reviews = await this.model
      .find({
        product: productId,
        isDeleted: false,
        isActive: true,
      })
      .populate({
        path: "user",
        select: "id name",
      })
      .lean();

    if (reviews.length === 0) {
      return {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      };
    }
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    const flooredAverageRating = Math.floor(averageRating * 10) / 10;
    return {
      reviews,
      averageRating: flooredAverageRating,
      totalReviews,
    };
  }
}

module.exports = ReviewService;
