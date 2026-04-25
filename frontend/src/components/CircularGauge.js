import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const SIZE = 132;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularGauge({ value, label, tint = colors.green700 }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * safeValue) / 100;

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.gray200}
          strokeWidth={STROKE}
          fill="transparent"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={tint}
          strokeWidth={STROKE}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(safeValue)}%</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center"
  },
  svg: {
    position: "absolute"
  },
  center: {
    alignItems: "center"
  },
  value: {
    color: colors.gray900,
    fontSize: 27,
    fontFamily: typography.display
  },
  label: {
    color: colors.gray500,
    fontSize: 11,
    fontFamily: typography.bold,
    marginTop: 2
  }
});
