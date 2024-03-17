import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "../Screen/AuthScreen/Register";
import Login from "../Screen/AuthScreen/Login";
import ResetPassword from "../Screen/AuthScreen/ResetPassword";
import Welcome from "../Screen/AuthScreen/Welcome";
import { View } from "react-native";

const Stack = createStackNavigator();

const PublicLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset"
          component={ResetPassword}
          options={{ title: "Reset Password", headerBackVisible: true }}
        />
        <Stack.Screen
          name="welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default PublicLayout;
