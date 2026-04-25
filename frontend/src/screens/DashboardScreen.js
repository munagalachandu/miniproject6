import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import MetricCard from "../components/MetricCard";
import PlantAvatar from "../components/PlantAvatar";
import InsightCard from "../components/InsightCard";
import { getSensorData } from "../api/plantApi";
import { colors } from "../theme/colors";

const fallbackReading = {
  temp: 28,
  humidity: 62,
  moisture: 54,
  water_level: 76,
  status: "happy"
};

export default function DashboardScreen() {
  const [deviceId, setDeviceId] = useState("plant-001");
  const [latest, setLatest] = useState(fallbackReading);
  const [insights, setInsights] = useState(["Connect your device to begin live monitoring."]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const savedDeviceId = (await AsyncStorage.getItem("device_id")) || "plant-001";
    setDeviceId(savedDeviceId);

    try {
      const response = await getSensorData(savedDeviceId);
      if (response.latest) {
        setLatest(response.latest);
      }
      setInsights(response.insights || []);
    } catch (error) {
      setInsights([error.message, "Showing demo values until the backend is reachable."]);
    }
  }

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 8000);
    return () => clearInterval(timer);
  }, []);

  const metrics = useMemo(
    () => [
      { title: "Temperature", value: Math.round(latest.temp), unit: "°C", icon: "thermometer", accent: "#FFE4DF" },
      { title: "Humidity", value: Math.round(latest.humidity), unit: "%", icon: "water", accent: "#DDEBFF" },
      { title: "Soil Moisture", value: Math.round(latest.moisture), unit: "%", icon: "leaf", accent: "#DDF8E8" },
      { title: "Tank Level", value: Math.round(latest.water_level), unit: "%", icon: "beaker", accent: "#FFF0C2" }
    ],
    [latest]
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadData();
            setRefreshing(false);
          }}
        />
      }
    >
      <LinearGradient colors={[colors.green800, colors.green500]} style={styles.hero}>
        <Text style={styles.kicker}>Smart Plant</Text>
        <Text style={styles.title}>Your plant is being watched with care.</Text>
        <Text style={styles.device}>Device: {deviceId}</Text>
      </LinearGradient>

      <PlantAvatar status={latest.status} />

      <View style={styles.grid}>
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </View>

      <InsightCard insights={insights} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    paddingTop: 58,
    paddingBottom: 110
  },
  hero: {
    padding: 22,
    borderRadius: 24,
    minHeight: 170,
    justifyContent: "space-between"
  },
  kicker: {
    color: colors.green200,
    fontWeight: "800",
    fontSize: 14
  },
  title: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 14
  },
  device: {
    color: colors.green200,
    fontWeight: "700",
    marginTop: 18
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginTop: 18
  }
});
