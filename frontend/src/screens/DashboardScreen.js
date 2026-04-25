import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
      {
        title: "Soil Moisture",
        value: Math.round(latest.moisture),
        unit: "%",
        icon: "leaf",
        accent: colors.green100,
        primary: true
      },
      { title: "Temperature", value: Math.round(latest.temp), unit: " C", icon: "thermometer", accent: "#FFE4DF" },
      { title: "Humidity", value: Math.round(latest.humidity), unit: "%", icon: "water", accent: "#DDEBFF" },
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
          tintColor={colors.green700}
          onRefresh={async () => {
            setRefreshing(true);
            await loadData();
            setRefreshing(false);
          }}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Plant Monitor</Text>
          <Text style={styles.greeting}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={loadData}>
          <Ionicons name="refresh" size={19} color={colors.green800} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={[colors.green850, colors.green700]} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.statusPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusPillText}>Live Device</Text>
          </View>
          <Text style={styles.device}>{deviceId}</Text>
        </View>
        <Text style={styles.title}>Your plant data is flowing in real time.</Text>
        <View style={styles.heroFooter}>
          <View>
            <Text style={styles.heroLabel}>Current status</Text>
            <Text style={styles.heroValue}>{latest.status}</Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="analytics" size={24} color={colors.white} />
          </View>
        </View>
      </LinearGradient>

      <PlantAvatar status={latest.status} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sensor Overview</Text>
        <Text style={styles.sectionMeta}>Auto refresh</Text>
      </View>

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
    padding: 18,
    paddingTop: 54,
    paddingBottom: 116
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  logoText: {
    color: colors.green700,
    fontSize: 14,
    fontWeight: "900"
  },
  greeting: {
    color: colors.black,
    fontSize: 31,
    fontWeight: "900",
    marginTop: 2
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  hero: {
    padding: 20,
    borderRadius: 26,
    minHeight: 210,
    justifyContent: "space-between",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)"
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green200
  },
  statusPillText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12
  },
  device: {
    color: colors.green200,
    fontWeight: "800"
  },
  title: {
    color: colors.white,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "900",
    marginTop: 22,
    maxWidth: 310
  },
  heroFooter: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  heroLabel: {
    color: colors.green200,
    fontWeight: "700",
    fontSize: 12
  },
  heroValue: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
    textTransform: "capitalize",
    marginTop: 3
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.17)",
    alignItems: "center",
    justifyContent: "center"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12
  },
  sectionTitle: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionMeta: {
    color: colors.green700,
    fontWeight: "800",
    fontSize: 12
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14
  }
});
