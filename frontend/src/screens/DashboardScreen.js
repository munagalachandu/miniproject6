import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CircularGauge from "../components/CircularGauge";
import SensorTile from "../components/SensorTile";
import PlantAvatar from "../components/PlantAvatar";
import InsightCard from "../components/InsightCard";
import { getSensorData } from "../api/plantApi";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

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

  const temp = Math.round(latest.temp);
  const humidity = Math.round(latest.humidity);
  const moisture = Math.round(latest.moisture);
  const waterLevel = Math.round(latest.water_level);

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

      <LinearGradient colors={[colors.green800, colors.green500]} style={styles.hero}>
        <View style={styles.heroBubbleLarge} />
        <View style={styles.heroBubbleSmall} />
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

      <InsightCard insights={insights} featured />

      <PlantAvatar status={latest.status} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sensor Overview</Text>
        <Text style={styles.sectionMeta}>Auto refresh</Text>
      </View>

      <View style={styles.panelMosaic}>
        <View style={styles.gaugePanel}>
          <View style={styles.gaugeHeader}>
            <View>
              <Text style={styles.panelEyebrow}>Priority</Text>
              <Text style={styles.panelTitle}>Soil Moisture</Text>
            </View>
            <View style={styles.leafBadge}>
              <Ionicons name="leaf" size={18} color={colors.white} />
            </View>
          </View>
          <View style={styles.gaugeBody}>
            <CircularGauge value={moisture} label="Moisture" tint={colors.green700} />
            <View style={styles.gaugeNote}>
              <Text style={styles.gaugeNoteValue}>{latest.status}</Text>
              <Text style={styles.gaugeNoteText}>Backend health status</Text>
            </View>
          </View>
        </View>

        <View style={styles.sideStack}>
          <SensorTile title="Temperature" value={temp} unit=" C" icon="thermometer" accent="#FFE4DF" compact />
          <SensorTile title="Humidity" value={humidity} unit="%" icon="water" accent="#DDEBFF" compact />
        </View>
      </View>

      <LinearGradient colors={["#FFF8DF", "#F4C95D"]} style={styles.tankPanel}>
        <View style={styles.tankSlab} />
        <View>
          <Text style={styles.tankLabel}>Tank Reserve</Text>
          <Text style={styles.tankValue}>{waterLevel}%</Text>
          <Text style={styles.tankHint}>Water level available</Text>
        </View>
        <View style={styles.tankIcon}>
          <Ionicons name="beaker" size={26} color={colors.green900} />
        </View>
      </LinearGradient>

      <View style={styles.motionRow}>
        <View style={styles.wavePanel}>
          <View style={styles.waveBarTall} />
          <View style={styles.waveBarMid} />
          <View style={styles.waveBarShort} />
          <View>
            <Text style={styles.waveTitle}>Pulse</Text>
            <Text style={styles.waveText}>Live readings every few seconds</Text>
          </View>
        </View>
        <View style={styles.miniPanel}>
          <Ionicons name="radio" size={22} color={colors.green700} />
          <Text style={styles.miniPanelValue}>ON</Text>
          <Text style={styles.miniPanelText}>Signal</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 16,
    paddingTop: 44,
    paddingBottom: 34
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
    fontFamily: typography.black
  },
  greeting: {
    color: colors.black,
    fontSize: 31,
    fontFamily: typography.display,
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
    position: "relative",
    padding: 20,
    borderRadius: 26,
    minHeight: 210,
    justifyContent: "space-between",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden"
  },
  heroBubbleLarge: {
    position: "absolute",
    right: -42,
    bottom: -48,
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  heroBubbleSmall: {
    position: "absolute",
    right: 62,
    top: 70,
    width: 38,
    height: 38,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
    backgroundColor: "rgba(244,201,93,0.26)",
    transform: [{ rotate: "24deg" }]
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
    fontFamily: typography.bold,
    fontSize: 12
  },
  device: {
    color: colors.green200,
    fontFamily: typography.bold
  },
  title: {
    color: colors.white,
    fontSize: 27,
    lineHeight: 33,
    fontFamily: typography.display,
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
    fontFamily: typography.semibold,
    fontSize: 12
  },
  heroValue: {
    color: colors.white,
    fontFamily: typography.display,
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
    fontFamily: typography.heading
  },
  sectionMeta: {
    color: colors.green700,
    fontFamily: typography.bold,
    fontSize: 12
  },
  panelMosaic: {
    flexDirection: "row",
    gap: 12
  },
  gaugePanel: {
    flex: 1.15,
    backgroundColor: colors.white,
    borderRadius: 28,
    borderTopRightRadius: 54,
    padding: 16,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4
  },
  gaugeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  panelEyebrow: {
    color: colors.green700,
    fontSize: 11,
    fontFamily: typography.black,
    textTransform: "uppercase"
  },
  panelTitle: {
    color: colors.gray900,
    fontSize: 17,
    fontFamily: typography.heading,
    marginTop: 3
  },
  leafBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.green700,
    alignItems: "center",
    justifyContent: "center"
  },
  gaugeBody: {
    alignItems: "center"
  },
  gaugeNote: {
    alignSelf: "stretch",
    borderRadius: 18,
    backgroundColor: colors.green100,
    padding: 12,
    marginTop: 12
  },
  gaugeNoteValue: {
    color: colors.green900,
    fontSize: 18,
    fontFamily: typography.display,
    textTransform: "capitalize"
  },
  gaugeNoteText: {
    color: colors.gray700,
    fontSize: 12,
    fontFamily: typography.semibold,
    marginTop: 3
  },
  sideStack: {
    flex: 0.85,
    gap: 12
  },
  tankPanel: {
    minHeight: 126,
    borderRadius: 28,
    borderTopLeftRadius: 8,
    padding: 18,
    marginTop: 14,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tankSlab: {
    position: "absolute",
    right: 76,
    top: -18,
    width: 52,
    height: 170,
    backgroundColor: "rgba(255,255,255,0.24)",
    transform: [{ rotate: "18deg" }]
  },
  tankLabel: {
    color: colors.green900,
    fontFamily: typography.heading,
    fontSize: 15
  },
  tankValue: {
    color: colors.green900,
    fontFamily: typography.display,
    fontSize: 38,
    marginTop: 6
  },
  tankHint: {
    color: colors.gray700,
    fontFamily: typography.semibold
  },
  tankIcon: {
    width: 60,
    height: 60,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center"
  },
  motionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14
  },
  wavePanel: {
    flex: 1,
    minHeight: 104,
    borderRadius: 26,
    borderBottomRightRadius: 8,
    backgroundColor: colors.white,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8
  },
  waveBarTall: {
    width: 12,
    height: 58,
    borderRadius: 6,
    backgroundColor: colors.green800
  },
  waveBarMid: {
    width: 12,
    height: 42,
    borderRadius: 6,
    backgroundColor: colors.green500
  },
  waveBarShort: {
    width: 12,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.green200
  },
  waveTitle: {
    color: colors.gray900,
    fontFamily: typography.heading,
    fontSize: 16
  },
  waveText: {
    color: colors.gray700,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  miniPanel: {
    width: 96,
    borderRadius: 26,
    borderTopLeftRadius: 8,
    backgroundColor: colors.green100,
    padding: 15,
    justifyContent: "center"
  },
  miniPanelValue: {
    color: colors.green900,
    fontSize: 22,
    fontFamily: typography.display,
    marginTop: 8
  },
  miniPanelText: {
    color: colors.gray700,
    fontFamily: typography.bold,
    fontSize: 12
  }
});
