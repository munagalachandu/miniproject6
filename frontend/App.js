import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import DashboardScreen from "./src/screens/DashboardScreen";
import GraphScreen from "./src/screens/GraphScreen";
import PlantSetupScreen from "./src/screens/PlantSetupScreen";
import { colors } from "./src/theme/colors";

const screens = {
  Dashboard: DashboardScreen,
  Graphs: GraphScreen,
  Setup: PlantSetupScreen
};

const navItems = [
  { name: "Dashboard", icon: "leaf" },
  { name: "Graphs", icon: "analytics" },
  { name: "Setup", icon: "settings" }
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const ActiveScreen = screens[activeScreen];

  return (
    <View style={styles.appShell}>
      <StatusBar style="light" />
      <View style={styles.sideNav}>
        <View style={styles.brandMark}>
          <Ionicons name="leaf" size={24} color={colors.white} />
        </View>

        <View style={styles.navGroup}>
          {navItems.map((item) => {
            const active = activeScreen === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navButton, active && styles.navButtonActive]}
                onPress={() => setActiveScreen(item.name)}
              >
                <Ionicons name={item.icon} size={21} color={active ? colors.green900 : colors.green200} />
                {active && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sideFooter}>
          <Text style={styles.sideLabel}>AI</Text>
        </View>
      </View>

      <View style={styles.screenHost}>
        <ActiveScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.green900
  },
  sideNav: {
    width: 76,
    backgroundColor: colors.green900,
    paddingTop: 38,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between"
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.green700,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5
  },
  navGroup: {
    gap: 16,
    alignItems: "center"
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center"
  },
  navButtonActive: {
    backgroundColor: colors.green200
  },
  activeDot: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green700
  },
  sideFooter: {
    width: 46,
    height: 46,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center"
  },
  sideLabel: {
    color: colors.green200,
    fontWeight: "900"
  },
  screenHost: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  }
});
