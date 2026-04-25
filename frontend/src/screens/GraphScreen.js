import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
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

  function renderChart(title, key, suffix, color) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{title}</Text>
        <LineChart
          data={chartData(key)}
          width={screenWidth - 64}
          height={210}
          bezier
          yAxisSuffix={suffix}
          chartConfig={{
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => color.replace("1)", `${opacity})`),
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
      <Text style={styles.title}>Growth Trends</Text>
      <Text style={styles.subtitle}>Smooth sensor history for moisture, temperature and humidity.</Text>

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

      {renderChart("Moisture", "moisture", "%", "rgba(69, 185, 124, 1)")}
      {renderChart("Temperature", "temp", "°", "rgba(255, 138, 122, 1)")}
      {renderChart("Humidity", "humidity", "%", "rgba(104, 167, 247, 1)")}
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
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.gray900
  },
  subtitle: {
    color: colors.gray700,
    marginTop: 8,
    lineHeight: 21
  },
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 4
  },
  toggle: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleActive: {
    backgroundColor: colors.green700
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
    borderRadius: 18,
    padding: 12,
    marginTop: 16,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.gray900,
    margin: 8
  },
  chart: {
    borderRadius: 16
  }
});
