import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import { Ionicons, AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { PORT_API } from "../../Utils/Config";
import Toast from "react-native-toast-message";
import OtpInput from "../../common/OtpInput";

export default function Register({ navigation }) {
  const [otpTimer, setOtpTimer] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [showTickIcon, setShowTickIcon] = useState(false);
  const [error, setError] = useState("");
  const [resendOTPStatus, setResendOTPStatus] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleEmailChange = (text) => {
    if (emailRegex.test(text)) {
      setShowTickIcon(true);
    } else {
      setShowTickIcon(false);
    }
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };
  const handleLastNameChange = (text) => {
    setLastName(text);
  };
  const handeCodeEmail = (text) => {
    setCodeText(text);
  };
  console.log(typeof (firstName + lastName));
  const confirmUserData = async () => {
    try {
      const response = await fetch(`${PORT_API}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: firstName + lastName,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const responseData = await response.json();
      console.log("responseData register", responseData);
      return true;
    } catch (error) {
      console.error("Error confirming user data:", error.message);
      return false;
    }
  };
  const handleSubmit = async (type) => {
    if (type === "SignUp") {
      if (firstName.trim() === "") {
        Alert.alert("Error", "Please enter first name");
        return;
      }
      if (lastName.trim() === "") {
        Alert.alert("Error", "Please enter last name");
        return;
      }
      if (email.trim() === "") {
        Alert.alert("Error", "Please enter your email");
        return;
      }
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
      if (password.trim() === "") {
        Alert.alert("Error", "Please enter your password");
        return;
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
      if (!passwordRegex.test(password)) {
        Alert.alert(
          "Error",
          "Password must contain at least one uppercase letter, one number, and be at least 8 characters long"
        );
        return;
      }

      if (!isChecked) {
        Alert.alert("Error", "Please tick the privacy checkbox");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/verify/send-otp?email=${email}&type=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Failed to send OTP";
            alert(errorMessage);
            return;
          } else {
            // For other non-successful status codes, throw a generic error message
            throw new Error("Failed to send OTP");
          }
        }
        setVerifyEmail(true);

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
    if (type === "Verify") {
      if (codeText.trim() === "") {
        Alert.alert("Error", "Please enter OTP Code");
        return;
      }
      const otpRegex = /^[0-9]+$/;
      if (!otpRegex.test(codeText)) {
        Alert.alert("Error", "OTP code must contain only numbers");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/verify/check-otp-register?fullName=${
            firstName + " " + lastName
          }&email=${email}&password=${password}&code=${codeText}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Failed to send OTP";
            alert(errorMessage);
          } else {
            throw new Error("Failed to send OTP");
          }
        }
        Toast.show({
          type: "tomatoToast",
          text1: "Account successfully created!",
          visibilityTime: 3000,
          autoHide: true,
          swipeable: true,
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        if (otpTimer) {
          clearTimeout(otpTimer);
          setOtpTimer(null);
        }

        navigation.navigate("login");
        setVerifyEmail(false);
        setCodeText("");
        setResendOTPStatus(false);
      } catch (error) {
        console.error("Error sending OTP:", error.message);
        Alert.alert("Error", "OTP Wrong.");
      } finally {
        setLoading(false);
      }
    }
  };
  const resendOTP = async () => {
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/verify/send-otp?email=${email}&type=1`,
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
        backgroundColor: verifyEmail ? "#fff" : "#110c31",
        flex: 1,
        position: "relative",
      }}
    >
      {verifyEmail ? (
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
          <TouchableOpacity
            onPress={() => handleSubmit("Verify")}
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
      ) : (
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
              Let's Start
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                color: "#fff",
                fontWeight: "500",
              }}
            >
              Explore events now!
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
              paddingBottom: 16,
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
              Sign Up
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                    marginLeft: 10,
                  }}
                >
                  First Name
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
                    placeholder="First Name"
                    onChangeText={handleFirstNameChange}
                    value={firstName}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 8,
                    marginLeft: 10,
                  }}
                >
                  Last Name
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
                    placeholder="Last Name"
                    onChangeText={handleLastNameChange}
                    value={lastName}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 8,
                  marginLeft: 10,
                }}
              >
                Email Address
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
                    // backgroundColor: "#110c31",
                    color: "#fff",
                    borderRadius: 4,
                    borderColor: "#9e9eae",
                  }}
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? "#8089b9" : undefined}
                />

                <Text
                  style={{
                    width: "80%",
                    fontWeight: "500",
                    fontSize: 13,
                    color: "#8782a8",
                  }}
                >
                  I agree to the Terms and Conditions and Privacy Policy
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleSubmit("SignUp")}
              style={{
                width: "100%",
                paddingVertical: 15,
                borderRadius: 16,
                backgroundColor: "#110c31",
                marginTop: 30,
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
                    fontSize: 15,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 13, color: Colors.BLACK }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text
                  style={{ color: "#110c31", fontWeight: "700", fontSize: 15 }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 48, // Height of the input field
    fontSize: 15, // Font size of the text inside input
  },
});
