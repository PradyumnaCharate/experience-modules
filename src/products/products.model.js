const mongoose = require("mongoose");
const {
  name,
  description,
  email,
  softDelete,
  createdBy,
  updatedBy,
  numberType,
  booleanType,
  isActive,
  isDeleted,
} = require("../../common/commonDatabaseFields");
const esClient = require("../../config/esClient");

const productSchema = new mongoose.Schema(
  {
    name: name("User", true),
    description: description(true),
    price: numberType("Price", true),
    stock: numberType("Stock", true),
    isAvailable: booleanType(true),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
productSchema.post("save", async function () {
  const product = this;
  const { _id, name, description, price, isAvailable } = product;

  try {
    await esClient.index({
      index: "products",
      id: _id.toString(),
      body: {
        name,
        description,
        price,
      },
    });
    await esClient.indices.refresh({ index: 'products' });
  } catch (error) {
    console.error("Error indexing document:", error);
  }
});
productSchema.post('findOneAndUpdate', async function () {
  const product = await this.model.findOne(this.getQuery());
  const { _id, name, description, price } = product;

  try {
    await esClient.index({
      index: 'products',
      id: _id.toString(),
      body: {
        name,
        description,
        price,
      },
    });
    await esClient.indices.refresh({ index: 'products' });
  } catch (error) {
    console.error('Error indexing document:', error);
  }
});
productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.isAvailable = false;
  } else {
    this.isAvailable = true;
  }
  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.stock === 0) {
    update.isAvailable = false;
  } else {
    update.isAvailable = true;
  }
  next();
});

productSchema.methods.softDelete = function () {
  return softDelete(this);
};
productSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Product", productSchema);
