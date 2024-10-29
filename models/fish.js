const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, require: true },
    content: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

const fishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    age: {
      type: Number,
    },
    size: {
      type: Number,
      required: true,
    },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "type" },
    feedingAmount: {
      type: Number,
      required: true,
    },
    screeningRate: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Thuần chủng nhập khẩu", "Lai F1", "Thuần Việt"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    certificates: [
      {
        type: String,
      },
    ],
    yob: {
      type: Number,
      required: true,
    },
    comments: [commentSchema],
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "voucher",
      },
    ],
    consignmentStatus: { type: String, default: "Available" },
  },
  { timestamps: true }
);

fishSchema.pre("save", function (next) {
  const currentYear = new Date().getFullYear();
  this.age = currentYear - this.yob;
  next();
});

module.exports = mongoose.model("fish", fishSchema);
