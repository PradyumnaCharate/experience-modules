const mongoose = require("mongoose");
const {
  name,
  description,
  email,
  softDelete,
  createdBy,
  updatedBy,
  reference,
  isDeleted,
  isActive,
} = require("../../common/commonDatabaseFields");

const permissiongroupSchema = new mongoose.Schema(
  {
    name: name("Permission Group", true),
    description: description(),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
permissiongroupSchema.methods.softDelete = function () {
  return softDelete(this);
};
permissiongroupSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Permissiongroup", permissiongroupSchema);
