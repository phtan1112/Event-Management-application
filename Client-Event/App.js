import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from 'expo-font';
import LoginScreen from './App/Screen/LoginScreen';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SecureStore from "expo-secure-store";
import Register from './App/Screen/AuthScreen/Login';
import AuthScreen from './App/Navigations/AuthScreen'
import TabNavigation from './App/Navigations/TabNavigation';

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
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
    <ClerkProvider
      publishableKey={'pk_test_c21hc2hpbmcta29pLTU1LmNsZXJrLmFjY291bnRzLmRldiQ'}
      tokenCache={tokenCache}>
      <SignedIn>
        <NavigationContainer>
          <TabNavigation />
        </NavigationContainer>
      </SignedIn>
      <SignedOut>
        {/* <LoginScreen /> */}
        <NavigationContainer>
          <AuthScreen />
        </NavigationContainer>
      </SignedOut>
      {/* <SafeAreaView style={styles.container}>
      </SafeAreaView> */}
    </ClerkProvider>
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
