import Constants from "expo-constants";

// Use your computer LAN IP here when testing on a physical phone.
export const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "API request failed");
  }

  return json;
}

export function getSensorData(deviceId) {
  return request(`/data/${deviceId}`);
}

export function savePlantProfile(payload) {
  return request("/plant", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function sendSampleSensorData(payload) {
  return request("/data", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
