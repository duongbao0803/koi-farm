const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: String,
    amount: Number,
    status: String,
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderProducts: [
      {
        amount: { type: Number, required: true, min: 1 },
        fishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "fish",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
    transferAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    transferPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["PENDING", "DELIVERING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
