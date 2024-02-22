import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";

import React, { useState } from "react";
import Colors from "../../Utils/Colors";
import EventDescription from "./EventDescription";
import EventPhotos from "./EventPhotos";

export default function EventDetail() {
  const param = useRoute().params;
  const navigation = useNavigation();

  const [event, setEvent] = useState(param.event);
  console.log("param", param);
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
  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  }
  const handleLocationPress = (location) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(mapUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };
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
    <View style={{ backgroundColor: "#fff" }}>
      <ScrollView style={{ height: "91%" }}>
        <TouchableOpacity
          style={styles.backBtnContainer}
          onPress={() => navigation.goBack()}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 100,
            }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <Image
          source={{ uri: event?.image1 }}
          style={{ width: "100%", height: 300 }}
        />
        <View style={styles.infoContainer}>
          <Text
            style={{
              fontFamily: "appFont-semi",
              fontSize: 25,
              textTransform: "capitalize",
              color: Colors.PRIMARY,
            }}
          >
            {event?.title}
          </Text>
          <View style={{ marginLeft: 5 }}>
            <View style={styles.subContainer}>
              <Text
                style={{
                  fontFamily: "appFont-medium",
                  //   color: Colors.PRIMARY,
                  fontSize: 20,
                }}
              >
                {event?.user?.fullName} 🌟
              </Text>
              <Text
                style={{
                  backgroundColor: "#e8ebfd",
                  color: Colors.PRIMARY,
                  padding: 5,
                  borderRadius: 5,
                  fontSize: 12,
                }}
              >
                {event?.category?.typeOfEvent}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleLocationPress(event?.place)}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "appFont",
                  color: "#8a8282",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Ionicons
                  name="ios-location-sharp"
                  size={25}
                  color={Colors.PRIMARY}
                  style={{ marginRight: 10 }}
                />
                {event?.place}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 0.4,
              borderColor: Colors.PRIMARY,
              borderStyle: "dashed",
              marginVertical: 10,
            }}
          ></View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "appFont-semi",
            }}
          >
            Date and Time
          </Text>
          <View
            style={{
              marginLeft: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "#e8ebfd",
                borderRadius: 8,
              }}
            >
              <MaterialIcons
                name="date-range"
                size={24}
                color={Colors.PRIMARY}
              />
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 15,
                  color: Colors.PRIMARY,
                }}
              >
                {formatDate(event?.date_start)}
              </Text>
              <Text>
                {getDayOfWeek(event?.date_start)},{" "}
                {formatTime(event?.time_start)} - {formatTime(event?.time_end)}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.4,
              borderColor: Colors.PRIMARY,
              borderStyle: "dashed",
              marginVertical: 10,
            }}
          ></View>

          <EventDescription event={event} />

          <View
            style={{
              borderWidth: 0.4,
              borderColor: Colors.PRIMARY,
              borderStyle: "dashed",
              marginVertical: 10,
            }}
          ></View>

          <EventPhotos event={event} />
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 5,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: 18,
            borderRadius: 100,
            backgroundColor: "#e8ebfd",
            marginRight: 10,
          }}
        >
          <AntDesign name="sharealt" size={30} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 18,
            borderRadius: 100,
            backgroundColor: "#e8ebfd",
            marginRight: 15,
          }}
        >
          <Feather name="bookmark" size={30} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 50,
            flex: 1,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            elevation: 6,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "400",
            }}
          >
            Join Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtnContainer: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
  infoContainer: {
    padding: 20,
    display: "flex",
    gap: 7,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
