import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import DashboardScreen from "./src/screens/DashboardScreen";
import GraphScreen from "./src/screens/GraphScreen";
import PlantSetupScreen from "./src/screens/PlantSetupScreen";
import { colors } from "./src/theme/colors";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.green700,
          tabBarInactiveTintColor: colors.gray500,
          tabBarStyle: {
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 18,
            height: 68,
            paddingBottom: 9,
            paddingTop: 8,
            borderTopWidth: 0,
            borderRadius: 24,
            backgroundColor: colors.white,
            shadowColor: colors.green900,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 18,
            elevation: 8
          },
          tabBarLabelStyle: {
            fontWeight: "800"
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === "Dashboard"
                ? "leaf"
                : route.name === "Graphs"
                  ? "analytics"
                  : "settings";

            return <Ionicons name={iconName} color={color} size={size} />;
          }
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Graphs" component={GraphScreen} />
        <Tab.Screen name="Setup" component={PlantSetupScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
