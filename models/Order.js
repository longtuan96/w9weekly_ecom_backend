const mongoose = require("mongoose");
const Product = require("./Product");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: String, default: "" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: "" }],
    status: { type: String, emum: ["pending", "paid"], default: "pending" },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamp: true }
);

orderSchema.plugin(require("./plugins/isDeletedFalse"));
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
