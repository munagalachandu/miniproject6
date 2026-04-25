import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import DashboardScreen from "./src/screens/DashboardScreen";
import GraphScreen from "./src/screens/GraphScreen";
import PlantSetupScreen from "./src/screens/PlantSetupScreen";
import { colors } from "./src/theme/colors";
import { typography } from "./src/theme/typography";

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
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold
  });
  const ActiveScreen = screens[activeScreen];

  if (!fontsLoaded) {
    return <View style={styles.appShell} />;
  }

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
    backgroundColor: colors.green950
  },
  sideNav: {
    width: 76,
    backgroundColor: colors.green950,
    paddingTop: 38,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between"
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.green800,
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
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center"
  },
  navButtonActive: {
    backgroundColor: colors.green100
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
    fontFamily: typography.black
  },
  screenHost: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  }
});
