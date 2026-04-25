import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function InsightCard({ insights, featured }) {
  const CardShell = featured ? LinearGradient : View;
  const shellProps = featured ? { colors: [colors.green850, colors.green700] } : {};

  return (
    <CardShell {...shellProps} style={[styles.card, featured && styles.featuredCard]}>
      {featured && <View style={styles.featureGlow} />}
      <View style={styles.header}>
        <View style={[styles.iconBadge, featured && styles.featureIcon]}>
          <Ionicons name="sparkles" size={18} color={featured ? colors.white : colors.green800} />
        </View>
        <View>
          <Text style={[styles.title, featured && styles.featureTitle]}>AI Care Coach</Text>
          <Text style={[styles.subtitle, featured && styles.featureSubtitle]}>Smart actions from live sensor patterns</Text>
        </View>
      </View>

      {insights.slice(0, featured ? 2 : insights.length).map((item) => (
        <View key={item} style={styles.insightRow}>
          <View style={[styles.dot, featured && styles.featureDot]} />
          <Text style={[styles.item, featured && styles.featureItem]}>{item}</Text>
        </View>
      ))}

      {featured ? (
        <View style={styles.actionRow}>
          <View style={styles.actionPill}>
            <Ionicons name="water" size={14} color={colors.green900} />
            <Text style={styles.actionText}>Hydrate</Text>
          </View>
          <View style={styles.actionPill}>
            <Ionicons name="sunny" size={14} color={colors.green900} />
            <Text style={styles.actionText}>Shade</Text>
          </View>
        </View>
      ) : (
        <View style={styles.factBox}>
          <Text style={styles.factTitle}>Fun Fact</Text>
          <Text style={styles.fact}>
            Some plants can communicate stress by releasing tiny chemical signals into the air.
          </Text>
        </View>
      )}
    </CardShell>
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
  featuredCard: {
    position: "relative",
    borderRadius: 30,
    borderTopLeftRadius: 10,
    overflow: "hidden",
    marginTop: 14,
    shadowOpacity: 0.18,
    elevation: 8
  },
  featureGlow: {
    position: "absolute",
    right: -34,
    top: -38,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "rgba(255,255,255,0.10)"
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
  featureIcon: {
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.gray900
  },
  featureTitle: {
    color: colors.white
  },
  subtitle: {
    color: colors.gray500,
    fontSize: 12,
    marginTop: 2
  },
  featureSubtitle: {
    color: colors.green200
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 9
  },
  featureDot: {
    backgroundColor: colors.green200
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green500,
    marginTop: 7
  },
  featureItem: {
    color: colors.white,
    fontWeight: "700"
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8
  },
  actionPill: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: colors.green200,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  actionText: {
    color: colors.green900,
    fontWeight: "900",
    fontSize: 12
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
