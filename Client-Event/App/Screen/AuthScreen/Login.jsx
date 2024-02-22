import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import COLORS from "../../Utils/Colors";
import Button from "../../common/Button";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <View style={styles.container}>
    //   <Spinner visible={loading} />

    //   <TextInput
    //     autoCapitalize="none"
    //     placeholder="simon@galaxies.dev"
    //     value={emailAddress}
    //     onChangeText={setEmailAddress}
    //     style={styles.inputField}
    //   />
    //   <TextInput
    //     placeholder="password"
    //     value={password}
    //     onChangeText={setPassword}
    //     secureTextEntry
    //     style={styles.inputField}
    //   />

    //   <Button onPress={onSignInPress} title="Login" color={"#6c47ff"}></Button>

    //   <TouchableOpacity
    //     style={styles.button}
    //     onPress={() => navigation.push("reset")}
    //   >
    //     <Text>Forgot password?</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     style={styles.button}
    //     onPress={() => navigation.push("register")}
    //   >
    //     <Text>Create Account</Text>
    //   </TouchableOpacity>
    // </View>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.WHITE, marginTop: 20 }}
    >
      <Spinner visible={loading} />
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: COLORS.BLACK,
            }}
          >
            Hi Welcome Back ! 👋
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.BLACK,
            }}
          >
            Hello again you have been missed!
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Email address
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.BLACK,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 15,
            }}
          >
            <TextInput
              autoCapitalize="none"
              placeholder="quocan@gmail.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Password
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.BLACK,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 15,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.BLACK} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.BLACK} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.PRIMARY : undefined}
          />

          <Text>Remember Me</Text>
        </View>

        <Button
          title="Login"
          filled
          onPress={onSignInPress}
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.GREY,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or Login with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.GREY,
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.GREY,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../../../assets/images/facebook.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.GREY,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../../../assets/images/google.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text>Google</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 22,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.BLACK }}>
            Don't have an account ?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("register")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.PRIMARY,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text>or</Text>
          <Pressable onPress={() => navigation.navigate("reset")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.PRIMARY,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Forgot Password
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Login;
