const mongoose = require("mongoose");
const {
  name,
  description,
  email,
  softDelete,
  createdBy,
  updatedBy,
  isDeleted,
  isActive,
  reference,
} = require("../../common/commonDatabaseFields");

const roleSchema = new mongoose.Schema(
  {
    name: name("Role", true),
    description: description(),
    isOutOfBox: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 4,
    },
    isActive: isActive,
    isDeleted: isDeleted,

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
roleSchema.methods.softDelete = function () {
  return softDelete(this);
};
roleSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Role", roleSchema);
