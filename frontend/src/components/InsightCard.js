import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function InsightCard({ insights }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color={colors.yellow} />
        <Text style={styles.title}>Insights</Text>
      </View>

      {insights.map((item) => (
        <Text key={item} style={styles.item}>
          {item}
        </Text>
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
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.gray900
  },
  item: {
    color: colors.gray700,
    lineHeight: 21,
    marginBottom: 8
  },
  factBox: {
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.mint
  },
  factTitle: {
    fontWeight: "800",
    color: colors.green800,
    marginBottom: 6
  },
  fact: {
    color: colors.gray700,
    lineHeight: 20
  }
});
