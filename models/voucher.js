const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountAmount: { type: Number, required: true },
    expireDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 1 },
    usedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        dateUsed: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("voucher", voucherSchema);
