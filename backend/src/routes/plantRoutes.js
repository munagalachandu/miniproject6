const express = require("express");
const Plant = require("../models/Plant");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { plant_name, device_id } = req.body;

    if (!plant_name || !device_id) {
      return res.status(400).json({ message: "plant_name and device_id are required" });
    }

    const plant = await Plant.findOneAndUpdate(
      { device_id },
      { plant_name, device_id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ message: "Plant profile saved", plant });
  } catch (error) {
    res.status(500).json({ message: "Failed to save plant profile", error: error.message });
  }
});

router.get("/:device_id", async (req, res) => {
  try {
    const plant = await Plant.findOne({ device_id: req.params.device_id });

    if (!plant) {
      return res.status(404).json({ message: "Plant profile not found" });
    }

    res.json({ plant });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plant profile", error: error.message });
  }
});

module.exports = router;
