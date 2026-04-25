import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { savePlantProfile, sendSampleSensorData } from "../api/plantApi";
import { colors } from "../theme/colors";

export default function PlantSetupScreen() {
  const [plantName, setPlantName] = useState("Mint");
  const [deviceId, setDeviceId] = useState("plant-001");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSavedSetup() {
      const savedPlantName = await AsyncStorage.getItem("plant_name");
      const savedDeviceId = await AsyncStorage.getItem("device_id");
      if (savedPlantName) setPlantName(savedPlantName);
      if (savedDeviceId) setDeviceId(savedDeviceId);
    }

    loadSavedSetup();
  }, []);

  async function handleSave() {
    if (!plantName.trim() || !deviceId.trim()) {
      Alert.alert("Missing details", "Please enter both plant name and device ID.");
      return;
    }

    setSaving(true);

    try {
      await savePlantProfile({ plant_name: plantName.trim(), device_id: deviceId.trim() });
      await AsyncStorage.multiSet([
        ["plant_name", plantName.trim()],
        ["device_id", deviceId.trim()]
      ]);
      Alert.alert("Saved", "Your plant profile is ready.");
    } catch (error) {
      Alert.alert("Could not save", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function createDemoReading() {
    try {
      await sendSampleSensorData({
        device_id: deviceId.trim() || "plant-001",
        temp: 24 + Math.round(Math.random() * 12),
        humidity: 45 + Math.round(Math.random() * 35),
        moisture: 20 + Math.round(Math.random() * 60),
        water_level: Math.random() > 0.15 ? 30 + Math.round(Math.random() * 70) : 0
      });
      Alert.alert("Demo reading sent", "Open Dashboard or Graphs to see the update.");
    } catch (error) {
      Alert.alert("Could not send demo data", error.message);
    }
  }

  return (
    <View style={styles.screen}>
      <LinearGradient colors={[colors.mint, colors.green200]} style={styles.header}>
        <Ionicons name="leaf" size={42} color={colors.green800} />
        <Text style={styles.title}>Plant Setup</Text>
        <Text style={styles.subtitle}>Connect a plant profile to the sensor device in MongoDB.</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Plant name</Text>
        <TextInput
          value={plantName}
          onChangeText={setPlantName}
          placeholder="e.g. Basil"
          placeholderTextColor={colors.gray500}
          style={styles.input}
        />

        <Text style={styles.label}>Device ID</Text>
        <TextInput
          value={deviceId}
          onChangeText={setDeviceId}
          placeholder="e.g. plant-001"
          placeholderTextColor={colors.gray500}
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
          <Ionicons name="save" size={20} color={colors.white} />
          <Text style={styles.primaryButtonText}>{saving ? "Saving..." : "Save Plant"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={createDemoReading}>
          <Ionicons name="flask" size={20} color={colors.green800} />
          <Text style={styles.secondaryButtonText}>Send Demo Sensor Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 58
  },
  header: {
    borderRadius: 24,
    padding: 22,
    minHeight: 190,
    justifyContent: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.green900,
    marginTop: 12
  },
  subtitle: {
    color: colors.gray700,
    lineHeight: 21,
    marginTop: 8
  },
  form: {
    marginTop: 22,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  label: {
    color: colors.gray700,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 10
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    color: colors.gray900,
    fontWeight: "700"
  },
  primaryButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.green700,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 22
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 16
  },
  secondaryButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  secondaryButtonText: {
    color: colors.green800,
    fontWeight: "900",
    fontSize: 16
  }
});
