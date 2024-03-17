import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Utils/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Heading({ title, viewAll }) {
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 21, fontWeight: "700", color: Colors.PRIMARY }}
        >
          {title}
        </Text>
        {viewAll && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Events");
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#3a3a3a" }}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
