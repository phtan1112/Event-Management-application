import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import Colors from "../../Utils/Colors";
import { Ionicons, AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Toast from "react-native-toast-message";
import { PORT_API } from "../../Utils/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserLogin } from "../../Context/context";
import OtpInput from "../../common/OtpInput";

export default function Login({ navigation }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Check valid email
  const [otpTimer, setOtpTimer] = useState(null);
  const [email, setEmail] = useState("");
  const [emailForgot, setEmailForgot] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [showTickIcon, setShowTickIcon] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusForgot, setStatusForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [statusNewPassword, setStatusNewPassword] = useState(false);
  const [resendOTPStatus, setResendOTPStatus] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);
  const { userData, saveUserData } = useUserLogin();

  const handleEmailChange = (text) => {
    if (emailRegex.test(text)) {
      setShowTickIcon(true);
    } else {
      setShowTickIcon(false);
    }
    setEmail(text);
  };
  const handleEmailForgotChange = (text) => {
    setEmailForgot(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };
  const handeCodeEmail = (text) => {
    setCodeText(text);
  };

  const saveDataToLocalStorage = async (userData) => {
    const userDataString = JSON.stringify(userData);
    try {
      await AsyncStorage.setItem("userData", userDataString);
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleSubmit = async (type) => {
    if (type === "login") {
      if (email.trim() === "") {
        setError("Please enter your email");
        return;
      }
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (password.trim() === "") {
        setError("Please enter your password");
        return;
      }
      setError(false);
      try {
        setLoading(true);
        const response = await fetch(`${PORT_API}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to log in");
        }
        const responseData = await response.json();
        console.log(responseData);
        await saveDataToLocalStorage(responseData?.user);
        saveUserData(responseData?.user);
        Toast.show({
          type: "tomatoToast",
          text1: "Logged in successfully!",
          visibilityTime: 3000,
          autoHide: true,
          swipeable: true,
        });
        setEmail("");
        setPassword("");
      } catch (error) {
        Alert.alert("Error", "Please check your email or password again.");
      } finally {
        setLoading(false);
      }
    }

    if (type === "Verify") {
    }

    if (type === "new-password") {
      if (codeText.trim() === "") {
        Alert.alert("Error", "Please enter OTP Code");
        return;
      }
      const otpRegex = /^[0-9]+$/;
      // if (!otpRegex.test(codeText)) {
      //   Alert.alert("Error", "OTP code must contain only numbers");
      //   return;
      // }
      if (newPassword.trim() === "") {
        Alert.alert("Error", "Please enter your new password");
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
      if (!passwordRegex.test(newPassword)) {
        Alert.alert(
          "Error",
          "New Password must contain at least one uppercase letter, one number, and be at least 8 characters long"
        );
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/verify/check-otp-restore?email=${emailForgot}&password=${newPassword}&code=${codeText}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send OTP");
        }
        Toast.show({
          type: "tomatoToast",
          text1: "Password successfully restored!",
          visibilityTime: 3000,
          autoHide: true,
          swipeable: true,
        });
        setEmailForgot("");
        setNewPassword("");
        if (otpTimer) {
          clearTimeout(otpTimer);
          setOtpTimer(null);
        }
        navigation.navigate("login");
        setVerifyEmail(false);
        setCodeText("");
        setResendOTPStatus(false);
      } catch (error) {
        Alert.alert("Error", "OTP Wrong.");
      } finally {
        setLoading(false);
      }
    }
    if (type === "email") {
      if (emailForgot.trim() === "") {
        Alert.alert("Error", "Please enter email");

        return;
      }
      if (!emailRegex.test(emailForgot)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/verify/send-otp?email=${emailForgot}&type=2`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send OTP");
        }
        setVerifyEmail(true);
        setStatusForgot(false);

        // otpTimer = setTimeout(() => {
        //   Alert.alert("Error", "OTP has expired. Please re-enter the code.");
        //   setResendOTPStatus(true);
        // }, 60000);
        setOtpTimer(
          setTimeout(() => {
            // Store timeout ID in state
            Alert.alert("Error", "OTP has expired. Please re-enter the code.");
            setResendOTPStatus(true);
          }, 60000)
        );
      } catch (error) {
        console.error("Error sending OTP:", error.message);
        Alert.alert("Error", "Failed to send OTP. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };
  const resendOTP = async () => {
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/verify/send-otp?email=${emailForgot}&type=2`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to re-send OTP");
      }
      Alert.alert("Success", "OTP sent successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP.");
    }
  };
  return (
    <ScrollView
      style={{
        backgroundColor: statusForgot || verifyEmail ? "#fff" : "#110c31",
        flex: 1,
        position: "relative",
      }}
    >
      {!statusForgot && !verifyEmail && (
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 15,
              borderRadius: 100,
              position: "absolute",
              top: 50,
              left: 30,
              zIndex: 10,
              backgroundColor: "#fff",
            }}
          >
            <AntDesign name="caretleft" size={18} color="#110c31" />
          </TouchableOpacity>
          <View style={{ paddingTop: 100, paddingBottom: 80 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                color: "#fff",
                fontWeight: "700",
                marginBottom: 5,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                color: "#fff",
                fontWeight: "500",
              }}
            >
              Sign in to your account
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              flex: 1,
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
              paddingHorizontal: 30,
              paddingTop: 50,
              paddingBottom: 85,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: "#000",
                fontWeight: "800",
                marginBottom: 10,
              }}
            >
              Sign In
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 8,
                  marginLeft: 10,
                }}
              >
                Your Email
              </Text>
              <View
                style={{
                  backgroundColor: "#ebebf4",
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="quocan@gmail.com"
                  onChangeText={handleEmailChange}
                  value={email}
                  autoCapitalize="none"
                />
                {showTickIcon ? (
                  <Entypo name="check" size={24} color="#7b7f93" />
                ) : (
                  ""
                )}
              </View>
            </View>
            <View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  backgroundColor: "#ebebf4",
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="***********"
                  autoCapitalize="none"
                  onChangeText={handlePasswordChange}
                  value={password}
                  secureTextEntry={isPasswordShown}
                />
                <Ionicons
                  name={isPasswordShown ? "eye" : "eye-off"}
                  size={24}
                  color="#7b7f93"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 6,
                }}
              >
                <Checkbox
                  style={{
                    marginRight: 8,
                    color: "#fff",
                    borderRadius: 4,
                    borderColor: "#9e9eae",
                  }}
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? "#110c31" : undefined}
                />
                <Text style={{ fontWeight: "500", fontSize: 13 }}>
                  Remember Me
                </Text>
              </View>
              <TouchableOpacity onPress={() => setStatusForgot(true)}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#7b7f93",
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 10,
                fontSize: 18,
                color: "red",
                fontWeight: "600",
              }}
            >
              {error ? error : ""}
            </Text>
            <TouchableOpacity
              onPress={() => handleSubmit("login")}
              style={{
                width: "100%",
                paddingVertical: 15,
                borderRadius: 16,
                opacity: loading ? 0.5 : 1,
                backgroundColor: "#110c31",
                marginTop: 30,
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : (
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Sign in
                </Text>
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 15,
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 13, color: Colors.BLACK }}>
                Don't have an account ?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("register")}>
                <Text
                  style={{ color: "#110c31", fontWeight: "700", fontSize: 15 }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {statusForgot && (
        <View
          style={{
            flexDirection: "column",
            padding: 20,
            marginTop: 20,
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#110c31" }}>
            Please Verify Your Email
          </Text>
          <View
            style={{
              backgroundColor: "#ebebf4",
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={{
                fontSize: 20,
                flex: 1,
                fontWeight: "600",
              }}
              placeholder="Email"
              onChangeText={handleEmailForgotChange}
              value={emailForgot}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            onPress={() => handleSubmit("email")}
            style={{
              width: "100%",
              paddingVertical: 15,
              borderRadius: 16,
              backgroundColor: "#110c31",
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "",
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : (
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 18,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {verifyEmail && (
        <View
          style={{
            flexDirection: "column",
            padding: 20,
            marginTop: 20,
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#110c31" }}>
            Restore Password
          </Text>

          <OtpInput length={6} onComplete={handeCodeEmail} />
          {resendOTPStatus && (
            <TouchableOpacity onPress={resendOTP} style={{ marginTop: -10 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#110c31",
                  textAlign: "right",
                }}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              backgroundColor: "#ebebf4",
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={{
                fontSize: 20,
                flex: 1,
                fontWeight: "600",
              }}
              placeholder="New Password"
              onChangeText={handleNewPasswordChange}
              value={newPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            onPress={() => handleSubmit("new-password")}
            style={{
              width: "100%",
              paddingVertical: 15,
              borderRadius: 16,
              backgroundColor: "#110c31",
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "",
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : (
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 18,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                Change Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#ebebf4",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    height: 48,
    fontSize: 15,
  },
});
