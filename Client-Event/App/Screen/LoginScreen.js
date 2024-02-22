import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import loginImg from "../../assets/images/login.png";
import * as WebBrowser from "expo-web-browser";
import Colors from "../Utils/Colors";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Image source={loginImg} style={styles.loginImg} />
      <View style={styles.subContainer}>
        <Text style={styles.heading}>
          Welcome to TAEVENT - Your Ultimate Event Experience
        </Text>
        <Text style={styles.desc}>
          Discover, Connect, and Elevate Your Event Experience with our Event App.
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text
            style={{
              color: Colors.BLACK,
              textAlign: "center",
              fontSize: 17,
            }}
          >
            Login With Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logoImg: {
    width: 230,
    height: 450,
    marginTop: 50,
    borderWidth: 4,
    borderColor: Colors.BLACK,
    borderRadius: 15,
    display: 'flex',
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    color: Colors.WHITE
  },
  desc: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 15,
    color: Colors.WHITE,
  },
  button: {
    backgroundColor: Colors.WHITE,
    padding: 16,
    display: "flex",
    borderRadius: 99,
    marginTop: 40,
    marginHorizontal: 20,
  },
  subContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    marginTop: -280,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20
  },
});
