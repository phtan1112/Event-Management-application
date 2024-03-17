import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon
        key={i}
        name={i <= rating ? "star" : "star-o"}
        size={20}
        color={i <= rating ? "#FFD700" : "#C0C0C0"} // Filled star color: Gold, Outline star color: Light gray
      />
    );
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}
