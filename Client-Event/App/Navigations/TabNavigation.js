import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Tabs } from "expo-router/tabs";
import { Tabs } from "expo-router";
import Colors from "../Utils/Colors.js";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Appointment from "../Screen/Appointment.js";
import Profile from "../Screen/Profile.js";
import Home from "../Screen/Home.js";
import CreateEvent from "../Screen/CreateEvent/CreateEvent.jsx";
import HomeNavigation from "./HomeNavigation.jsx";
import { createStackNavigator } from '@react-navigation/stack';
import EventDetail from "../Components/EventDetail/EventDetail.jsx";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


// function SettingsStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="event-detail" component={EventDetail} options={{
//         headerShown: false
//       }} />
//     </Stack.Navigator>
//   )
// }

function HomeTabs() {
  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            width: '95%',
            height: 65,
            borderRadius: 16,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            marginBottom: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 10
          }
        }}>
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
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Appointment}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: 'My Profile',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}


export default function TabNavigation() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            width: '95%',
            height: 65,
            borderRadius: 16,
            backgroundColor: '#fff',
            marginHorizontal: 10
          },
          tabBarItemStyle: {
            paddingVertical: 10
          }
        }}>
        <Tab.Screen
          name="Home"
          component={HomeNavigation}
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
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Appointment}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: 'My Profile',
          }}
        />
      </Tab.Navigator> */}
      <Stack.Navigator >
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{
          headerShown: false
        }} />
        <Stack.Screen name="event-detail" component={EventDetail} options={{
          headerShown: false
        }} />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red'
  }
});