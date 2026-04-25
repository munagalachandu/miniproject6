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
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
            borderTopWidth: 0,
            backgroundColor: colors.white
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
