import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getSensorData } from "../api/plantApi";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const screenWidth = Dimensions.get("window").width;
const chartWidth = Math.max(250, screenWidth - 136);
const ranges = ["Day", "Week", "Month"];
const calendarDays = [
  { date: "21", day: "Mon" },
  { date: "22", day: "Tue" },
  { date: "23", day: "Wed" },
  { date: "24", day: "Thu" },
  { date: "25", day: "Fri" },
  { date: "26", day: "Sat" }
];

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
    const value = slicedReadings[slicedReadings.length - 1]?.[key] ?? 0;

    return (
      <View style={[styles.chartCard, title === "Moisture" && styles.featureChart, title === "Humidity" && styles.softChart]}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleWrap}>
            <View style={[styles.chartIcon, { backgroundColor: color.soft }]}>
              <Ionicons name={icon} size={18} color={color.solid} />
            </View>
            <Text style={styles.chartTitle}>{title}</Text>
          </View>
          <View style={styles.chartValuePill}>
            <Text style={styles.chartValue}>{Math.round(value)}{suffix}</Text>
          </View>
        </View>
        <LineChart
          data={chartData(key)}
          width={chartWidth}
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
        {calendarDays.map((item, index) => (
          <View key={item.date} style={[styles.dayChip, index === 4 && styles.dayChipActive]}>
            <Text style={[styles.dayDate, index === 4 && styles.dayDateActive]}>{item.date}</Text>
            <Text style={[styles.dayName, index === 4 && styles.dayNameActive]}>{item.day}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.summaryRail}>
        <View style={styles.summaryLarge}>
          <View style={styles.summaryBlob} />
          <Text style={styles.summaryLabel}>Moisture Flow</Text>
          <Text style={styles.summaryValue}>{Math.round(slicedReadings[slicedReadings.length - 1]?.moisture || 0)}%</Text>
        </View>
        <View style={styles.summaryStack}>
          <View style={styles.summarySmall}>
            <Ionicons name="thermometer" size={18} color={colors.coral} />
            <Text style={styles.summarySmallValue}>{Math.round(slicedReadings[slicedReadings.length - 1]?.temp || 0)} C</Text>
          </View>
          <View style={[styles.summarySmall, styles.summarySmallAlt]}>
            <Ionicons name="water" size={18} color={colors.blue} />
            <Text style={styles.summarySmallValue}>{Math.round(slicedReadings[slicedReadings.length - 1]?.humidity || 0)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.schedulePanel}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Care Calendar</Text>
          <View style={styles.calendarButton}>
            <Ionicons name="calendar" size={17} color={colors.green800} />
          </View>
        </View>
        {[
          ["08:15", "Check moisture trend", "leaf"],
          ["12:30", "Shade review", "sunny"],
          ["17:45", "Tank refill check", "water"]
        ].map(([time, title, icon]) => (
          <View key={title} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{time}</Text>
            <View style={styles.scheduleDot}>
              <Ionicons name={icon} size={14} color={colors.green800} />
            </View>
            <Text style={styles.scheduleText}>{title}</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.gray500} />
          </View>
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
    padding: 16,
    paddingTop: 44,
    paddingBottom: 34
  },
  header: {
    marginBottom: 18
  },
  title: {
    fontSize: 31,
    fontFamily: typography.display,
    color: colors.black
  },
  subtitle: {
    color: colors.gray700,
    fontFamily: typography.body,
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
  calendarStrip: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 2
  },
  dayChip: {
    width: 58,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2
  },
  dayChipActive: {
    backgroundColor: colors.green800,
    borderTopRightRadius: 8
  },
  dayDate: {
    color: colors.gray900,
    fontFamily: typography.display,
    fontSize: 18
  },
  dayDateActive: {
    color: colors.white
  },
  dayName: {
    color: colors.gray500,
    fontFamily: typography.bold,
    fontSize: 11,
    marginTop: 3
  },
  dayNameActive: {
    color: colors.green200
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
    fontFamily: typography.bold
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
  featureChart: {
    borderTopRightRadius: 56,
    borderBottomLeftRadius: 10
  },
  softChart: {
    borderTopLeftRadius: 56,
    borderBottomRightRadius: 10
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
    fontFamily: typography.heading,
    color: colors.gray900
  },
  chartValuePill: {
    minWidth: 58,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  chartValue: {
    color: colors.green800,
    fontFamily: typography.bold
  },
  chart: {
    borderRadius: 18
  },
  schedulePanel: {
    backgroundColor: colors.white,
    borderRadius: 28,
    borderTopLeftRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  scheduleTitle: {
    color: colors.gray900,
    fontSize: 18,
    fontFamily: typography.heading
  },
  calendarButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: colors.green100,
    alignItems: "center",
    justifyContent: "center"
  },
  scheduleItem: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  scheduleTime: {
    width: 48,
    color: colors.green800,
    fontFamily: typography.bold
  },
  scheduleDot: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: colors.green100,
    alignItems: "center",
    justifyContent: "center"
  },
  scheduleText: {
    flex: 1,
    color: colors.gray900,
    fontFamily: typography.semibold
  },
  summaryRail: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16
  },
  summaryLarge: {
    flex: 1,
    minHeight: 142,
    borderRadius: 28,
    borderTopRightRadius: 8,
    backgroundColor: colors.green800,
    padding: 17,
    overflow: "hidden",
    justifyContent: "space-between"
  },
  summaryBlob: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  summaryLabel: {
    color: colors.green200,
    fontFamily: typography.bold,
    fontSize: 14
  },
  summaryValue: {
    color: colors.white,
    fontSize: 42,
    fontFamily: typography.display
  },
  summaryStack: {
    width: 118,
    gap: 12
  },
  summarySmall: {
    flex: 1,
    borderRadius: 24,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.white,
    padding: 13,
    justifyContent: "space-between"
  },
  summarySmallAlt: {
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 6
  },
  summarySmallValue: {
    color: colors.gray900,
    fontSize: 18,
    fontFamily: typography.display
  }
});
