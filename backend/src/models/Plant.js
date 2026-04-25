const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    plant_name: {
      type: String,
      required: true,
      trim: true
    },
    device_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
