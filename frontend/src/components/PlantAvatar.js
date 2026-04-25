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
  const bob = useRef(new Animated.Value(0)).current;
  const avatar = avatarMap[status] || avatarMap.neutral;

  useEffect(() => {
    const pulse = Animated.loop(
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
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true
        })
      ])
    );

    pulse.start();
    float.start();
    return () => {
      pulse.stop();
      float.stop();
    };
  }, [bob, scale]);

  return (
    <LinearGradient colors={avatar.gradient} style={styles.wrap}>
      <View style={styles.orbitOne} />
      <View style={styles.orbitTwo} />
      <Animated.View style={[styles.emojiBubble, { transform: [{ scale }, { translateY: bob }] }]}>
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
    borderColor: colors.gray200,
    overflow: "hidden"
  },
  orbitOne: {
    position: "absolute",
    right: -22,
    top: -24,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(35,122,86,0.08)"
  },
  orbitTwo: {
    position: "absolute",
    right: 40,
    bottom: -18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(244,201,93,0.18)"
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
