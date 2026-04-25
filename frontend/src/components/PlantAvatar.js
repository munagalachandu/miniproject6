import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

const avatarMap = {
  happy: { emoji: "🌱", label: "Happy", colors: ["#DDF8E8", "#B9EFD0"] },
  neutral: { emoji: "🌿", label: "Steady", colors: ["#EDF5D1", "#DCEAA2"] },
  sad: { emoji: "🥀", label: "Needs care", colors: ["#FFE4DF", "#FFC6BC"] }
};

export default function PlantAvatar({ status }) {
  const scale = useRef(new Animated.Value(1)).current;
  const avatar = avatarMap[status] || avatarMap.neutral;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [scale]);

  return (
    <LinearGradient colors={avatar.colors} style={styles.wrap}>
      <Animated.View style={[styles.emojiBubble, { transform: [{ scale }] }]}>
        <Text style={styles.emoji}>{avatar.emoji}</Text>
      </Animated.View>
      <View>
        <Text style={styles.status}>{avatar.label}</Text>
        <Text style={styles.copy}>Plant health</Text>
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
    borderRadius: 22,
    marginTop: 18
  },
  emojiBubble: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.64)",
    alignItems: "center",
    justifyContent: "center"
  },
  emoji: {
    fontSize: 40
  },
  status: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.green900
  },
  copy: {
    color: colors.gray700,
    marginTop: 4,
    fontWeight: "600"
  }
});
