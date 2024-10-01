const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/user.model");
const Fish = require("../models/fish.model");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect to MongoDB");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
