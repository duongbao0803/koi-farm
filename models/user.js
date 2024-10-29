const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "MEMBER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
