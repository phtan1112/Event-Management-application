import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import nightlife from "../../../assets/images/nightlife.png";
import Colors from "../../Utils/Colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AllEventListItem({ event }) {
  const navigation = useNavigation();
  const handleLocationPress = (location) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(mapUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };
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
  return (
    <View
      style={{
        padding: 5,
        borderWidth: 1,
        borderColor: "#eaeeff",
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: "#52006A",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 3,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.GRAY,
          // borderStyle: "dashed",
          paddingBottom: 8,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: event?.image1 }}
            style={{ width: 130, height: 130, borderRadius: 8 }}
          />
          <Text
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              color: Colors.PRIMARY,
              fontSize: 13,
              fontWeight: "600",
              backgroundColor: "#fff",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 12,
            }}
          >
            {formatDate(event?.date_start)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
            flex: 1,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 20,
              color: Colors.PRIMARY,
              fontWeight: "500",
              width: "80%",
            }}
          >
            {event?.title}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                paddingVertical: 3,
                paddingHorizontal: 15,
                borderRadius: 50,
                borderWidth: 1,
                fontSize: 12,
                borderColor: Colors.PRIMARY,
                color: Colors.PRIMARY,
              }}
            >
              {event?.category?.typeOfEvent}
            </Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Ionicons
                name="ios-location-sharp"
                size={25}
                color={Colors.PRIMARY}
              />
              <Text numberOfLines={1} style={{ fontSize: 13, width: "70%" }}>
                {event?.place}
              </Text>
            </View>
            <Feather name="bookmark" size={26} color={Colors.PRIMARY} />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 5,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.push("event-detail", {
              event: event,
            })
          }
        >
          <Text
            style={{
              backgroundColor: Colors.PRIMARY,
              color: "#fff",
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 50,
              fontSize: 17,
              fontWeight: "500",
              elevation: 5,
            }}
          >
            See Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLocationPress(event?.place)}>
          <Text
            style={{
              backgroundColor: "#fff",
              color: Colors.PRIMARY,
              paddingHorizontal: 50,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: Colors.PRIMARY,
              borderRadius: 50,
              fontSize: 17,
              fontWeight: "500",
              elevation: 5,
            }}
          >
            See Map
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
