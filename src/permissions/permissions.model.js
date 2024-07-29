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
const { generateRandomNumber } = require("../../utils/generateRandomNumber");

const permissionSchema = new mongoose.Schema(
  {
    name: name("Permission", true),
    description: description(),
    code: numberType("Code", false),
    permissionGroup: reference("Permissiongroup", true),
    priority: numberType("Priority"),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

permissionSchema.pre("save", function (next) {
  const code = generateRandomNumber(4);
  this.code = code;
  next();
});

permissionSchema.methods.softDelete = function () {
  return softDelete(this);
};
// permissionSchema.index(
//   { name: 1 },
//   { unique: true, partialFilterExpression: { isDeleted: false } }
// );
permissionSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Permission", permissionSchema);
