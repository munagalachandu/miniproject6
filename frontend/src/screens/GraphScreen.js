import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getSensorData } from "../api/plantApi";
import { colors } from "../theme/colors";

const screenWidth = Dimensions.get("window").width;
const ranges = ["Day", "Week", "Month"];

function buildDemoData() {
  return Array.from({ length: 8 }).map((_, index) => ({
    createdAt: new Date(Date.now() - (7 - index) * 60 * 60 * 1000).toISOString(),
    moisture: 44 + index * 2,
    temp: 27 + (index % 3),
    humidity: 58 + index
  }));
}

export default function GraphScreen() {
  const [range, setRange] = useState("Day");
  const [readings, setReadings] = useState(buildDemoData());

  async function loadHistory() {
    try {
      const deviceId = (await AsyncStorage.getItem("device_id")) || "plant-001";
      const response = await getSensorData(deviceId);
      if (response.data?.length) {
        setReadings(response.data);
      }
    } catch {
      setReadings(buildDemoData());
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const slicedReadings = useMemo(() => {
    const amount = range === "Day" ? 8 : range === "Week" ? 14 : 24;
    return readings.slice(-amount);
  }, [range, readings]);

  function chartData(key) {
    return {
      labels: slicedReadings.map((item, index) => (index % 3 === 0 ? new Date(item.createdAt).getDate().toString() : "")),
      datasets: [{ data: slicedReadings.map((item) => Number(item[key] || 0)) }]
    };
  }

  function renderChart(title, key, suffix, color, icon) {
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleWrap}>
            <View style={[styles.chartIcon, { backgroundColor: color.soft }]}>
              <Ionicons name={icon} size={18} color={color.solid} />
            </View>
            <Text style={styles.chartTitle}>{title}</Text>
          </View>
          <Text style={styles.chartMeta}>{range}</Text>
        </View>
        <LineChart
          data={chartData(key)}
          width={screenWidth - 60}
          height={214}
          bezier
          yAxisSuffix={suffix}
          chartConfig={{
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => color.rgba.replace("1)", `${opacity})`),
            labelColor: () => colors.gray500,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: colors.white
            },
            propsForBackgroundLines: {
              stroke: colors.gray200
            }
          }}
          style={styles.chart}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Clean plant trends for every sensor.</Text>
      </View>

      <View style={styles.toggleWrap}>
        {ranges.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.toggle, range === item && styles.toggleActive]}
            onPress={() => setRange(item)}
          >
            <Text style={[styles.toggleText, range === item && styles.toggleTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderChart(
        "Moisture",
        "moisture",
        "%",
        { rgba: "rgba(35, 122, 86, 1)", solid: colors.green700, soft: colors.green100 },
        "leaf"
      )}
      {renderChart(
        "Temperature",
        "temp",
        " C",
        { rgba: "rgba(255, 138, 122, 1)", solid: colors.coral, soft: "#FFE4DF" },
        "thermometer"
      )}
      {renderChart(
        "Humidity",
        "humidity",
        "%",
        { rgba: "rgba(104, 167, 247, 1)", solid: colors.blue, soft: "#DDEBFF" },
        "water"
      )}
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
    marginBottom: 18
  },
  title: {
    fontSize: 31,
    fontWeight: "900",
    color: colors.black
  },
  subtitle: {
    color: colors.gray700,
    marginTop: 6,
    lineHeight: 21
  },
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 22,
    marginBottom: 4,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2
  },
  toggle: {
    flex: 1,
    height: 44,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleActive: {
    backgroundColor: colors.green800
  },
  toggleText: {
    color: colors.gray700,
    fontWeight: "800"
  },
  toggleTextActive: {
    color: colors.white
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 12,
    marginTop: 16,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 8,
    marginBottom: 4
  },
  chartTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  chartIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.gray900
  },
  chartMeta: {
    color: colors.green700,
    fontWeight: "900"
  },
  chart: {
    borderRadius: 18
  }
});
