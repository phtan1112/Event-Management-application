import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EventDescription({ event }) {
  const [isReadMore, setIsReadMore] = useState(false);

  function formatTimeDifference(startTime, endTime) {
    // Parse the start and end time strings into Date objects
    const startDate = new Date(`2000-01-01T${startTime}`);
    const endDate = new Date(`2000-01-01T${endTime}`);

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(endDate - startDate);

    // Convert the time difference to hours and minutes
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    // Construct the formatted time string
    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      if (hours > 0) {
        formattedTime += ` `;
      }
      formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    return formattedTime.trim();
  }
  return (
    <View>
      <Text
        style={{ fontSize: 20, fontFamily: "appFont-semi", marginBottom: 10 }}
      >
        About this event
      </Text>
      <View style={{ marginLeft: 5 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 5,
          }}
        >
          <View
            style={{ padding: 5, backgroundColor: "#e8ebfd", borderRadius: 8 }}
          >
            <MaterialCommunityIcons
              name="progress-clock"
              size={24}
              color={Colors.PRIMARY}
            />
          </View>
          <Text style={{ fontWeight: "500" }}>
            {formatTimeDifference(event?.time_start, event?.time_end)}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "appFont",
            color: "#8a8282",
            fontSize: 16,
            lineHeight: 28,
          }}
          numberOfLines={isReadMore ? 20 : 5}
        >
          {event?.description} In publishing and graphic design, Lorem ipsum is
          a placeholder text commonly used to demonstrate the visual form of a
          document or a typeface without relying on meaningful content. Lorem
          ipsum may be used as a placeholder before the final copy is available.
        </Text>
        <TouchableOpacity onPress={() => setIsReadMore(!isReadMore)}>
          <Text
            style={{
              color: Colors.PRIMARY,
              fontSize: 16,
              fontFamily: "appFont",
            }}
          >
            {isReadMore ? "Read Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
