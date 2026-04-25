const mongoose = require("mongoose");

const alertLogSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    lastWaterEmptyAlertAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AlertLog", alertLogSchema);
