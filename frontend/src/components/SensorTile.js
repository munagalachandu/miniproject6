import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function SensorTile({ title, value, unit, icon, accent, compact }) {
  return (
    <View style={[styles.tile, compact && styles.compactTile]}>
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <Ionicons name={icon} size={compact ? 16 : 19} color={colors.green900} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {value}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 15,
    minHeight: 116,
    justifyContent: "space-between",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  compactTile: {
    minHeight: 96,
    padding: 13,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 34
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  copy: {
    gap: 4
  },
  title: {
    color: colors.gray700,
    fontSize: 12,
    fontFamily: typography.bold
  },
  value: {
    color: colors.gray900,
    fontSize: 27,
    fontFamily: typography.display
  },
  unit: {
    color: colors.gray500,
    fontSize: 13,
    fontFamily: typography.bold
  }
});
