const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("type", typeSchema);
