import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function MetricCard({ title, value, unit, icon, accent, primary }) {
  const CardShell = primary ? LinearGradient : View;
  const shellProps = primary ? { colors: [colors.green800, colors.green500] } : {};

  return (
    <CardShell {...shellProps} style={[styles.card, primary && styles.primaryCard]}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: primary ? "rgba(255,255,255,0.18)" : accent }]}>
          <Ionicons name={icon} size={21} color={primary ? colors.white : colors.green900} />
        </View>
        <View style={[styles.arrowWrap, primary && styles.primaryArrow]}>
          <Ionicons name="arrow-up" size={15} color={primary ? colors.green900 : colors.green800} />
        </View>
      </View>

      <Text style={[styles.title, primary && styles.primaryTitle]}>{title}</Text>
      <Text style={[styles.value, primary && styles.primaryValue]}>
        {value}
        <Text style={[styles.unit, primary && styles.primaryUnit]}>{unit}</Text>
      </Text>
      <Text style={[styles.caption, primary && styles.primaryCaption]}>Live sensor reading</Text>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 148,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4
  },
  primaryCard: {
    backgroundColor: colors.green800
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }]
  },
  primaryArrow: {
    backgroundColor: colors.white,
    borderColor: colors.white
  },
  title: {
    fontSize: 13,
    color: colors.gray700,
    fontFamily: typography.semibold,
    marginBottom: 8
  },
  primaryTitle: {
    color: colors.green200
  },
  value: {
    fontSize: 34,
    fontFamily: typography.display,
    color: colors.gray900
  },
  primaryValue: {
    color: colors.white
  },
  unit: {
    fontSize: 14,
    fontFamily: typography.bold,
    color: colors.gray500
  },
  primaryUnit: {
    color: colors.green200
  },
  caption: {
    marginTop: 8,
    color: colors.green700,
    fontSize: 11,
    fontFamily: typography.bold
  },
  primaryCaption: {
    color: colors.green200
  }
});
