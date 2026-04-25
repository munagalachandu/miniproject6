import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

const avatarMap = {
  happy: {
    emoji: "\uD83C\uDF31",
    label: "Happy",
    detail: "Moisture is in the sweet spot",
    gradient: ["#F8FAF8", "#DDF8E8"]
  },
  neutral: {
    emoji: "\uD83C\uDF3F",
    label: "Steady",
    detail: "Keep monitoring today",
    gradient: ["#F8FAF8", "#EDF5D1"]
  },
  sad: {
    emoji: "\uD83E\uDD40",
    label: "Needs care",
    detail: "Watering may be needed",
    gradient: ["#FFF8F5", "#FFE4DF"]
  }
};

export default function PlantAvatar({ status }) {
  const scale = useRef(new Animated.Value(1)).current;
  const avatar = avatarMap[status] || avatarMap.neutral;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true
        })
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [scale]);

  return (
    <LinearGradient colors={avatar.gradient} style={styles.wrap}>
      <Animated.View style={[styles.emojiBubble, { transform: [{ scale }] }]}>
        <Text style={styles.emoji}>{avatar.emoji}</Text>
      </Animated.View>
      <View style={styles.copyWrap}>
        <Text style={styles.eyebrow}>Plant Health</Text>
        <Text style={styles.status}>{avatar.label}</Text>
        <Text style={styles.copy}>{avatar.detail}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 24,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gray200
  },
  emojiBubble: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  emoji: {
    fontSize: 40
  },
  copyWrap: {
    flex: 1
  },
  eyebrow: {
    color: colors.green700,
    fontWeight: "900",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase"
  },
  status: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.green900
  },
  copy: {
    color: colors.gray700,
    marginTop: 4,
    fontWeight: "600",
    lineHeight: 19
  }
});
