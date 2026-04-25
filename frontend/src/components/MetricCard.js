import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function MetricCard({ title, value, unit, icon, accent }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accent }]}>
        <Ionicons name={icon} size={21} color={colors.green900} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {value}
        <Text style={styles.unit}>{unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 132,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14
  },
  title: {
    fontSize: 13,
    color: colors.gray700,
    marginBottom: 8
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.gray900
  },
  unit: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray500
  }
});
