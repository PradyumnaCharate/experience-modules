const mongoose = require("mongoose");

//for validating email regex
exports.validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//Following Common fields are to be used in respective schemas.
exports.name = (name, required) =>
  required
    ? {
        type: String,
        required: [true, `Please Enter ${name} Name`],

        maxLength: [255, `${name} Name cannot exceed 255 characters`],
        minLength: [2, `${name} Name should have more than 2 characters`],
        trim: true,
      }
    : {
        type: String,
        maxLength: [255, `${name} Name cannot exceed 255 characters`],
        minLength: [2, `${name} Name should have more than 2 characters`],
        trim: true,
      };

exports.description = (required = true) => {
  return {
    type: String,
    required: [required, `Please Enter Description.`],
    maxLength: [5000, "Description cannot exceed 5000 characters"],
    trim: true,
  };
};

exports.purpose = (required = true) => {
  return {
    type: String,
    required: [required, `Please Enter Purpose.`],
    maxLength: [5000, "Purpose cannot exceed 5000 characters"],
    trim: true,
  };
};

exports.email = (name) => {
  return {
    type: String,
    required: [true, `Please Enter ${name} Email`],

    validate: [this.validateEmail, "Please fill a valid email address"],
    trim: true,
  };
};

exports.softDelete = async (instance) => {
  instance.isDeleted = true;
  instance.deletedAt = new Date();
  instance.isActive = false;
  await instance.save();
};






exports.isDeleted = {
  type: Boolean,
  default: false,
};
exports.booleanType = (defaultValue) => {
  return {
    type: Boolean,
    default: defaultValue
  };
};
exports.isActive = {
  type: Boolean,
  default: true,
};

exports.password = {
  type: String,
  required: [true, "Please Enter Password"],
  minLength: [8, "Password should have more than 8 characters"],
  select: false,
  trim: true,
};

exports.code = {
  type: Number,
  required: true,
  unique: true,
};


exports.reference = (model, required = false) => {
  if (required) {
    return {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${model}`,
      required: [true, `${model} is required`],
    };
  } else return { type: mongoose.Schema.Types.ObjectId, ref: `${model}` };
};

exports.dateType = (name, required = true) => {
  if (required) {
    return { type: Date, required: [true, `${name} Date is required field.`] };
  } else return { type: Date };
};

exports.stringType = (name,min,max, required = true) => {
  if (required) {
    return {
      type: String,
      required: [true, `${name} is required field.`],
      trim: true,
      maxLength: [max, `${name} cannot exceed 255 characters`],
      minLength: [min, `${name} should have more than 2 characters`],
    };
  } else return { type: String, trim: true,maxLength: [max, `${name} cannot exceed 255 characters`],
  minLength: [min, `${name} should have more than 2 characters`], };
};

exports.numberType = (name,min,max, required = true) => {
  if (required) {
    return { type: Number, required: [true, `${name} is required field.`],  min, max  };
  } else return { type: Number, min, max  };
};
