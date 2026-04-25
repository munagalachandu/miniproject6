import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function InsightCard({ insights }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name="sparkles" size={18} color={colors.green800} />
        </View>
        <View>
          <Text style={styles.title}>Care Insights</Text>
          <Text style={styles.subtitle}>Rule based recommendations</Text>
        </View>
      </View>

      {insights.map((item) => (
        <View key={item} style={styles.insightRow}>
          <View style={styles.dot} />
          <Text style={styles.item}>{item}</Text>
        </View>
      ))}

      <View style={styles.factBox}>
        <Text style={styles.factTitle}>Fun Fact</Text>
        <Text style={styles.fact}>
          Some plants can communicate stress by releasing tiny chemical signals into the air.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.green100,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.gray900
  },
  subtitle: {
    color: colors.gray500,
    fontSize: 12,
    marginTop: 2
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 9
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green500,
    marginTop: 7
  },
  item: {
    flex: 1,
    color: colors.gray700,
    lineHeight: 21
  },
  factBox: {
    marginTop: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200
  },
  factTitle: {
    fontWeight: "900",
    color: colors.green800,
    marginBottom: 6
  },
  fact: {
    color: colors.gray700,
    lineHeight: 20
  }
});
