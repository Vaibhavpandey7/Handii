const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service_type: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  phone: { type: String, default: "Not available" },
  experience: { type: Number, default: 0 },
  availability: { type: Boolean, default: false },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Worker", workerSchema);
