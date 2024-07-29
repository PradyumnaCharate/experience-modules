const mongoose = require("mongoose");
const {
  name,
  description,
  email,
  softDelete,
  createdBy,
  updatedBy,
  contact,
  isActive,
  isDeleted,
  reference,
  password,
  stringType,
} = require("../../common/commonDatabaseFields");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { hashRounds } = require("../../config/variables");

const userSchema = new mongoose.Schema(
  {
    name: name("User", true),
    email: email("User"),
    password: password,
    isActive: isActive,
    isLocked: isDeleted,
    role: reference("Role", true),
    isDeleted: isDeleted,

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, hashRounds);
});
userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(
      this._update.password,
      hashRounds
    );
  }
  next();
});

userSchema.methods.softDelete = function () {
  return softDelete(this);
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE,
  });
};
userSchema.methods.getRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
  return refreshToken;
};

userSchema.index(
  { name: 1, email: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
    partialFilterExpression: { isDeleted: false },
  }
);

module.exports = mongoose.model("User", userSchema);
