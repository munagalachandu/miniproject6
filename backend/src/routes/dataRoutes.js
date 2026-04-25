const express = require("express");
const SensorData = require("../models/SensorData");
const AlertLog = require("../models/AlertLog");
const { getPlantStatus, getInsights } = require("../utils/health");
const { sendWaterTankEmptyAlert } = require("../services/twilioService");

const router = express.Router();

function isValidReading(body) {
  return (
    body.device_id &&
    Number.isFinite(Number(body.temp)) &&
    Number.isFinite(Number(body.humidity)) &&
    Number.isFinite(Number(body.moisture)) &&
    Number.isFinite(Number(body.water_level))
  );
}

async function maybeSendWaterAlert(deviceId, waterLevel) {
  if (Number(waterLevel) !== 0) return;

  const cooldownMinutes = Number(process.env.ALERT_COOLDOWN_MINUTES || 30);
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const now = new Date();
  const alertLog = await AlertLog.findOne({ device_id: deviceId });

  if (alertLog?.lastWaterEmptyAlertAt && now - alertLog.lastWaterEmptyAlertAt < cooldownMs) {
    return;
  }

  await sendWaterTankEmptyAlert();
  await AlertLog.findOneAndUpdate(
    { device_id: deviceId },
    { lastWaterEmptyAlertAt: now },
    { upsert: true, new: true }
  );
}

router.post("/", async (req, res) => {
  try {
    if (!isValidReading(req.body)) {
      return res.status(400).json({
        message: "device_id, temp, humidity, moisture and water_level are required numbers"
      });
    }

    const reading = {
      device_id: req.body.device_id,
      temp: Number(req.body.temp),
      humidity: Number(req.body.humidity),
      moisture: Number(req.body.moisture),
      water_level: Number(req.body.water_level)
    };

    const savedReading = await SensorData.create({
      ...reading,
      status: getPlantStatus(reading.moisture)
    });

    await maybeSendWaterAlert(reading.device_id, reading.water_level);

    res.status(201).json({
      message: "Sensor data saved",
      data: savedReading,
      status: savedReading.status,
      insights: getInsights(savedReading)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save sensor data", error: error.message });
  }
});

router.get("/:device_id", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 60), 300);
    const readings = await SensorData.find({ device_id: req.params.device_id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const orderedReadings = readings.reverse();
    const latest = orderedReadings[orderedReadings.length - 1] || null;

    res.json({
      device_id: req.params.device_id,
      latest,
      status: latest?.status || "neutral",
      insights: getInsights(latest),
      data: orderedReadings
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sensor data", error: error.message });
  }
});

module.exports = router;
