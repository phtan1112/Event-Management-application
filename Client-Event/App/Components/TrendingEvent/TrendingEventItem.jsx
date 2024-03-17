import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlightComponent,
} from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import { useNavigation } from "@react-navigation/native";
import { useUserLogin } from "../../Context/context";

const { width } = Dimensions.get("window");

export default function TrendingEventItem({ trendingEvent }) {
  const navigation = useNavigation();
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    return `${day} ${month}`;
  }
  function formatTime(time) {
    const [hours, minutes] = time.split(":");
    let formattedHours = parseInt(hours);
    let ampm = "AM";

    if (formattedHours >= 12) {
      ampm = "PM";
      formattedHours -= 12;
    }

    if (formattedHours === 0) {
      formattedHours = 12;
    }

    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.push("event-detail", { event: trendingEvent })}
      style={{
        position: "relative",
        width: Dimensions.get("screen").width * 0.85,
        height: 250,
        margin: 5,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: trendingEvent?.image1 }}
        style={{ width: "100%", height: " 100%" }}
      />
      <Text
        numberOfLines={1}
        style={{
          position: "absolute",
          top: 15,
          left: 20,
          color: "black",
          fontSize: 13,
          fontWeight: "700",
          borderRadius: 50,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: "#fff",
          shadowColor: "#52006A",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {trendingEvent?.numberOfParticipators} participant
      </Text>
      <Text
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          color: "black",
          fontSize: 13,
          fontWeight: "700",
          borderRadius: 10,
          paddingHorizontal: 20,
          paddingVertical: 8,
          backgroundColor: "#fff",
          shadowColor: "#52006A",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {formatDate(trendingEvent?.date_start)}
      </Text>
      <View
        style={{
          flexDirection: "column",
          position: "absolute",
          bottom: 20,
          left: 20,
          backgroundColor: "#fff",
          width: "90%",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 10,
          shadowColor: "#52006A",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            color: "black",
            fontWeight: "700",
            marginBottom: 8,
            width: "80%",
            textTransform: "capitalize",
          }}
        >
          {trendingEvent?.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{ uri: trendingEvent?.user?.avatar }}
              style={{ width: 30, height: 30, borderRadius: 100 }}
            />
            <Text style={{ fontSize: 13, color: "black", fontWeight: "700" }}>
              {trendingEvent?.user?.fullName}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#9c9898", fontWeight: "700" }}>
            {formatTime(trendingEvent?.time_start)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
