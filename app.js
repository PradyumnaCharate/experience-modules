const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const dotenv = require("dotenv");
const logger = require("./logger");
const app = express();
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res, next) =>
  res.json({ success: "Server Succesfully Running" })
);

const { permissiongroupRouter } = require("./src/permissionGroups");
const {
  rolepermissionsmappingRouter,
} = require("./src/rolePermissionsMappings");
const { permissionRouter } = require("./src/permissions");
const { roleRouter } = require("./src/roles");
const { userRouter } = require("./src/users");
const { productRouter } = require("./src/products");
const { reviewRouter } = require("./src/reviews");

app.use("/api", rolepermissionsmappingRouter);
app.use("/api", permissiongroupRouter);
app.use("/api", permissionRouter);
app.use("/api", roleRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", reviewRouter);

app.all("*", async (req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found. Kindly Check the API path as well as request type",
    },
  });
});
app.use(errorMiddleware);

module.exports = app;
