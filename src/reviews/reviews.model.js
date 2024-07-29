const mongoose = require("mongoose");
const {
  name,
  description,
  email,
  softDelete,
  createdBy,
  updatedBy,
  reference,
  numberType,
  stringType,
  isActive,
  isDeleted,
} = require("../../common/commonDatabaseFields");

const reviewSchema = new mongoose.Schema(
  {
    product: reference("Product", true),
    user: reference("User", true),
    rating: numberType("Rating", 1, 5),
    review: stringType("Review", 2, 500),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
reviewSchema.methods.softDelete = function () {
  return softDelete(this);
};
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Review", reviewSchema);
