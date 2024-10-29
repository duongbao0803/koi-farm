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
        name: { type: String, required: true },
        image: { type: String, required: true },
        amount: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 1 },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "fish",
          required: true,
        },
        certificates: [
          {
            type: String,
            description: { type: String },
          },
        ],
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    transferAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true, min: 1 },
    transferPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["PENDING", "DELIVERING", "DELIVERED"],
      default: "PENDING",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    transactions: [transactionSchema],
    consignmentRequest: {
      isConsigned: { type: Boolean, default: false },
      consignmentType: {
        type: String,
        enum: ["Offline", "Online"],
      },
      requestStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
