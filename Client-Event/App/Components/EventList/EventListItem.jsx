import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function EventListItem({ event }) {
  const navigation = useNavigation();
  const [status, setStatus] = useState();
  // console.log("event", event);
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
  const addRandomSpaces = (str) => {
    // Convert the string into an array of characters
    const characters = str.split("");

    // Define the maximum number of spaces to add (adjust as needed)
    const maxSpaces = 3;

    // Loop to add random spaces
    for (let i = 0; i < maxSpaces; i++) {
      // Generate a random index to insert the space
      const randomIndex =
        Math.floor(Math.random() * (characters.length - 1)) + 1;

      // Insert a space at the random index
      characters.splice(randomIndex, 0, " ");
    }

    // Join the characters back into a string
    return characters.join("");
  };
  const checkStatus = (dateStart, timeStart, timeEnd) => {
    // Convert date and time strings to JavaScript Date objects
    const startDate = new Date(dateStart + "T" + timeStart);
    const endDate = new Date(dateStart + "T" + timeEnd);
    const currentDate = new Date();

    // Define the "about to happen" threshold to be 2 hours before the event starts
    const aboutToHappenThreshold = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    // Compare the current date with the start and end dates to determine the status
    if (currentDate < startDate) {
      // status = "Planned";
      setStatus("Planned");
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "Ongoing";
      setStatus("Ongoing");
    } else {
      // status = "Ended";
      setStatus("Ended");
    }

    // Check if the event is about to happen within the threshold
    if (
      status === "Not yet happening" &&
      startDate - currentDate <= aboutToHappenThreshold
    ) {
      // status = "Upcoming";
      setStatus("Upcoming");
    }
  };
  useEffect(() => {
    checkStatus(event?.date_start, event?.time_start, event?.time_end);
  }, []);
  return (
    <View>
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
          <Text
            style={{
              position: "absolute",
              top: 0,
              left: 10,
              zIndex: 2,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginRight: 15,
              marginTop: 15,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 8,
              color: "#fff",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            {status}
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
    </View>
  );
}
