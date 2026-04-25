function getPlantStatus(moisture) {
  if (moisture > 50) return "happy";
  if (moisture >= 30) return "neutral";
  return "sad";
}

function getInsights(reading) {
  if (!reading) {
    return ["Waiting for sensor data from your plant device."];
  }

  const insights = [];

  if (reading.moisture < 30) {
    insights.push("Soil moisture is low. Consider watering your plant.");
  } else if (reading.moisture <= 50) {
    insights.push("Soil moisture is moderate. Keep an eye on it today.");
  } else {
    insights.push("Soil moisture looks healthy. Your plant is comfortable.");
  }

  if (reading.temp > 34) {
    insights.push("Temperature is high. Move the plant to shade if possible.");
  } else if (reading.temp < 15) {
    insights.push("Temperature is low. Keep the plant in a warmer spot.");
  }

  if (reading.humidity < 35) {
    insights.push("Humidity is low. A light misting may help leafy plants.");
  }

  if (reading.water_level === 0) {
    insights.push("Your water tank is empty. Please refill it soon.");
  }

  return insights;
}

module.exports = { getPlantStatus, getInsights };
