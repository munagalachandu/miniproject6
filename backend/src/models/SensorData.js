const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    temp: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },
    moisture: {
      type: Number,
      required: true
    },
    water_level: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["happy", "neutral", "sad"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
