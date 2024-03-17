import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
// import MapView from "react-native-map-clustering";
import { PORT_API } from "../../Utils/Config";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function EventAround() {
  const [allEvent, setAllEvent] = useState([]);
  const navigation = useNavigation();
  const [location, setLocation] = useState();
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert("Please grant location permissions");
        return;
      }
    };
    getPermissions();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/event/all-events?statusCode=1`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setAllEvent(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
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
        <Text
          style={{ fontSize: 20, fontWeight: "600", color: Colors.PRIMARY }}
        >
          Events Around You
        </Text>
      </TouchableOpacity>

      <MapView
        // style={styles.map}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
      >
        {allEvent.map((item, index) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item?.latitude,
              longitude: item?.longitude,
            }}
            onPress={() => navigation.push("event-detail", { event: item })}
          >
            {/* <View>
              <Image source={{ uri: item?.image1 }} />
            </View> */}
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: item?.image3 }}
                onError={() =>
                  console.log("Error loading image:", item?.image3)
                }
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 200,
                  borderWidth: 2,
                  borderColor: "red",
                }}
              />
            </View>
            {/* <View style={styles.marker}>
              <Text style={styles.markerText}>{item.title}</Text>
            </View> */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backBtnContainer: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 10,
    padding: 5,
    paddingRight: 20,
    backgroundColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 20,
  },
});
