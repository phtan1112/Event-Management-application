import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Screen/Home";
import EventDetail from "../Components/EventDetail/EventDetail";
const Stack = createStackNavigator();

export default function HomeNavigation({ navigation }) {
  navigation.setOptions({ tabBarVisible: false });
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homepage" component={Home} />
      <Stack.Screen name="event-detail" component={EventDetail} />
    </Stack.Navigator>
  );
}
