import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SecureStore from "expo-secure-store";
import Register from './App/Screen/AuthScreen/Login';
import TabNavigation from './App/Navigations/TabNavigation.jsx';
import 'react-native-gesture-handler'
import { Provider } from 'react-redux';
import { store } from './App/store/store';
import { UserProvider } from './App/Context/context';
import { EventProvider } from './App/Context/SaveContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import MainNavigation from './App/Navigations/MainNavigation';


const toastConfig = {

  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),

  tomatoToast: ({ text1, props }) => (
    <View style={{ gap: 8, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', backgroundColor: 'white', borderRadius: 10 }}>
      <AntDesign name="checkcircle" size={24} color="#30b22e" />
      <Text style={{ color: '#30b22e', textAlign: 'center', fontSize: 17, fontWeight: '600' }}>{text1}</Text>
      {/* <Text>{props.uuid}</Text> */}
    </View>
  )
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'appFont': require('./assets/fonts/Outfit-Regular.ttf'),
    'appFont-medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'appFont-bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'appFont-semi': require('./assets/fonts/Outfit-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <UserProvider>
      <EventProvider>
        <Provider store={store}>
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </Provider>
      </EventProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
