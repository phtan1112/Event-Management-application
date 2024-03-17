import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Tabs } from "expo-router/tabs";
import { Tabs } from "expo-router";
import Colors from "../Utils/Colors.js";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome, Foundation, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Appointment from "../Screen/Event.js";
import Profile from "../Screen/Profile.js";
import Home from "../Screen/Home.js";
import CreateEvent from "../Screen/CreateEvent/CreateEvent.jsx";
import { createStackNavigator } from "@react-navigation/stack";
import EventDetail from "../Components/EventDetail/EventDetail.jsx";
import Event from "../Screen/Event.js";
import { createDrawerNavigator } from "@react-navigation/drawer";
import EventAround from "../Components/EventAround/EventAround.jsx";
import SavedEvent from "../Components/SavedEvent/SavedEvent.jsx";
import MyEvent from "../Components/MyEvent/MyEvent.jsx";
import { useUserLogin } from "../Context/context.jsx";
import Register from "../Screen/AuthScreen/Register.jsx";
import Login from "../Screen/AuthScreen/Login.jsx";
import Welcome from "../Screen/AuthScreen/Welcome.jsx";
import ResetPassword from "../Screen/AuthScreen/ResetPassword.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import StatisticEvent from "../Components/Statistic/StatisticEvent.jsx";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeTabs() {
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            width: "95%",
            height: 65,
            borderRadius: 16,
            backgroundColor: "#fff",
            marginHorizontal: 10,
            marginBottom: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Create Event"
          component={CreateEvent}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Foundation name="page-add" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Events"
          component={Event}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default function TabNavigation() {
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const [userInfo, setUserInfo] = useState(null);
  const retrieveDataFromLocalStorage = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        // Data found, parse it to JSON
        const userData = JSON.parse(userDataString);
        setUserInfo(userData);
        console.log("Context Data for tab navigation ", userInfo?.token);
      } else {
        console.log("No data found in local storage.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  };
  useEffect(() => {
    retrieveDataFromLocalStorage();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        // initialRouteName={
        //   userInfo?.token || userData?.token ? "HomeTabs" : "welcome"
        // }
        initialRouteName="HomeTabs"
      >
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event-detail"
          component={EventDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event-around"
          component={EventAround}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="save-event"
          component={SavedEvent}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="available-event"
          component={MyEvent}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="statistic-event"
          component={StatisticEvent}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
  },
});
