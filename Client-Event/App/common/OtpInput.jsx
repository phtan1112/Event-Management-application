import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const OtpInput = ({ length, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // If the input is not empty, move focus to the next input
    if (index < length - 1 && value !== "") {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" || e.nativeEvent.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";

      // If the Backspace or Delete key is pressed, move focus to the previous input
      if (e.nativeEvent.key === "Backspace" && index > 0) {
        inputRefs.current[index - 1].focus();
      }

      setOtp(newOtp);
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.square, activeIndex === index && styles.active]}
          onPress={() => {
            inputRefs.current[index]?.focus();
            setActiveIndex(index);
          }}
        >
          <Text style={styles.digit}>{digit}</Text>
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            onFocus={() => setActiveIndex(index)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  square: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#ebebf4",
  },
  active: {
    backgroundColor: "#ffffff", // Change the background color of the active input
    borderWidth: 2,
    borderColor: "#110c31", // Add a border color to the active input
  },
  digit: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    opacity: 0,
  },
});

export default OtpInput;
