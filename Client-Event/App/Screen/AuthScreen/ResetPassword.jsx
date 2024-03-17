import { View, StyleSheet, TextInput, Text } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import Button from "../../common/Button";
import COLORS from "../../Utils/Colors";
import { PORT_API } from "../../Utils/Config";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  console.log(password);

  const saveDataToLocalStorage = async (userData) => {
    const userDataString = JSON.stringify(userData);
    try {
      await AsyncStorage.setItem("userData", userDataString);
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const onRequestReset = async () => {
    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err) {
      alert(err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (password) {
        const response = await fetch(`${PORT_API}/user/restore-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress,
            password: password,
          }),
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log("Change password successfully:", responseData);
          saveDataToLocalStorage(responseData.userDTO);
        } else {
          const errorData = await response.json();
          console.error("Change password failed:", errorData.error);
        }
      }

      alert("Password reset successfully");
      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err) {
      alert(err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      {!successfulCreation && (
        <>
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
                paddingLeft: 22,
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

          <Button
            onPress={onRequestReset}
            title="Send Reset Email"
            color={"#6c47ff"}
          ></Button>
          <Text
            style={{
              color: "#be1010",
              fontFamily: "appFont-semi",
            }}
          >
            {error}
          </Text>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
            <TextInput
              placeholder="New password"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />
          </View>
          <Button
            onPress={onReset}
            title="Set new Password"
            color={"#6c47ff"}
          ></Button>
          <Text
            style={{
              color: "#be1010",
              fontFamily: "appFont-semi",
            }}
          >
            {error}
          </Text>
        </>
      )}
    </View>
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

export default PwReset;
