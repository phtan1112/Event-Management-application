import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function EventListItem({ event }) {
  const navigation = useNavigation();

  console.log("event", event);
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
      style={{
        width: screenWidth * 0.75,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.GREY,
      }}
      onPress={() => navigation.push("event-detail", { event: event })}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: event?.image3 }}
          style={{ width: "100%", height: 170, objectFit: "fill" }}
        />
        <Text
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 2,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginRight: 15,
            marginTop: 15,
            backgroundColor: "#fff",
            borderRadius: 8,
            color: Colors.PRIMARY,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {formatDate(event?.date_start)}
        </Text>
      </View>
      <View
        style={{ paddingTop: 15, paddingHorizontal: 15, paddingBottom: 10 }}
      >
        <View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 20,
              fontWeight: "500",
              marginBottom: 10,
              textTransform: "capitalize",
            }}
          >
            {event?.title}
          </Text>
          <View
            style={{
              color: Colors.PRIMARY,
              fontSize: 15,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              // gap: 8,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                fontWeight: "500",
                fontSize: 12,
                borderRadius: 10,
                // alignItems: "flex-start",
                backgroundColor: "#a1ffd0",
              }}
            >
              {event?.category?.typeOfEvent}
            </Text>
            <View
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              <Text style={{ marginHorizontal: 5 }}> --- </Text>
              <FontAwesome5
                name="clock"
                size={18}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text>{formatTime(event?.time_start)}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -3,
            width: "90%",
          }}
        >
          <Entypo name="location-pin" size={26} color="black" />
          <Text numberOfLines={1} style={{ fontWeight: "500" }}>
            {event?.place}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
