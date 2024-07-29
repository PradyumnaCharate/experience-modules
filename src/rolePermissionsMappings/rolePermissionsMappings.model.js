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
  numberType,
} = require("../../common/commonDatabaseFields");

const rolepermissionsmappingSchema = new mongoose.Schema(
  {
    role: reference("Role", true),
    permission: numberType("Permission", 1000, 9999, true),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

rolepermissionsmappingSchema.methods.softDelete = function () {
  return softDelete(this);
};
rolepermissionsmappingSchema.index(
  { role: 1, permission: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model(
  "Rolepermissionsmapping",
  rolepermissionsmappingSchema
);
