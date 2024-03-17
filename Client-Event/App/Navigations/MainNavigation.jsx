// MainNavigation.js
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import { useAuth } from "./AuthContext";
import PublicLayout from "./AuthScreen";
import TabNavigation from "./TabNavigation";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserLogin } from "../Context/context";
import { PORT_API } from "../Utils/Config";

const Stack = createStackNavigator();

const MainNavigation = () => {
  //   const { userToken, isLoading } = useAuth();
  //   const userToken = false;
  const [userToken, setUserToken] = useState(false);
  const { userData, saveUserData, updateUserName } = useUserLogin();
  const removeUserData = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      console.log("UserData removed successfully");
    } catch (error) {
      console.error("Error removing UserData:", error);
    }
  };
  const checkTokenValid = async () => {
    try {
      // const userDataString = await AsyncStorage.getItem("userData");
      if (userData !== null) {
        // Data found, parse it to JSON
        // const userData = JSON.parse(userDataString);
        const token = userData?.token;
        const response = await fetch(`${PORT_API}/user/get-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Check if the response is successful
        if (response.ok) {
          console.log("Token is valid");
        } else {
          removeUserData();
          saveUserData(null);
        }
      } else {
        console.log("No data found in local storage.");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    checkTokenValid();
  }, [userData]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        {userData && userData?.token ? (
          <Stack.Screen
            name="App"
            component={TabNavigation}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={PublicLayout}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </View>
  );
};

export default MainNavigation;
