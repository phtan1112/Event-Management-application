import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Modal,
  Share,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
// import * as Sharing from "expo-sharing";
// import Share from "react-native-share";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import EventDescription from "./EventDescription";
import EventPhotos from "./EventPhotos";
import successIcon from "../../../assets/images/success-green.png";
import { PORT_API } from "../../Utils/Config";
import { useUserLogin } from "../../Context/context";
import { useEventContext } from "../../Context/SaveContext";
import CreateComment from "../Comment/CreateComment";

export default function EventDetail() {
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const { updateSavedEvent, updateTrendingEvent } = useEventContext();

  const param = useRoute().params;
  const navigation = useNavigation();
  const [event, setEvent] = useState(param.event);
  const [data, setData] = useState({
    idEvent: event?.id,
    email: userData?.email,
  });
  console.log("event", event?.status);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState();
  const [save, setSave] = useState(false);
  const [backCount, setBackCount] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to hide the modal
  const hideModal = () => {
    setIsModalVisible(false);
  };
  const handleShare = async (text, imageUrl) => {
    console.log(imageUrl);
    try {
      await Share.share({
        message: `${text}`,
        url: imageUrl,
        title: `${text}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const checkUserJoined = () => {
    const isUserJoined = event.participators.some(
      (participator) => participator.email === data.email
    );

    if (isUserJoined) {
      setIsUserJoined(true);
    } else {
      setIsUserJoined(false);
    }
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
  const handleJoinNow = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/event/add-participator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        // console.log("Response Data:", responseData);
        // setResponseData(responseData);
        setIsModalVisible(true);
        setIsUserJoined(true);
        updateTrendingEvent();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/event/detail/${event?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: basicAuth,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setParticipators(jsonData);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
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
  useEffect(() => {
    fetchData();
    checkUserJoined();
  }, []);
  useEffect(() => {
    const takeAllSaveEvent = async () => {
      try {
        const response = await fetch(`${PORT_API}/user/all-event-saved`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 400) {
            // setError(true);
            // alert(response.message);
            // const jsonData = await response.json();
            // console.log(jsonData);
          } else {
            throw new Error("Can't take event");
          }
        }
        // Handle success
        console.log("Take Saved Event successfully");
        const jsonData = await response.json();
        // console.log("all save", jsonData);
        const isEventSaved = (eventId, savedEvents) => {
          return savedEvents.includes(eventId);
        };
        if (jsonData && jsonData.length > 0) {
          const savedEventIds = jsonData.map((event) => event.id);
          console.log(savedEventIds);
          const isCurrentEventSaved = isEventSaved(event?.id, savedEventIds);
          console.log(isCurrentEventSaved);
          if (isCurrentEventSaved) {
            setBackCount(1);
          }
          setSave(isCurrentEventSaved);
        }
      } catch (error) {
        // Handle errors
        console.error("Error saving event:", error.message);
      }
    };

    takeAllSaveEvent();
  }, [event?.id, backCount]);
  const saveEvent = async (id) => {
    console.log("id", id);
    console.log("backCount", backCount);
    if (backCount % 2 === 1) {
      // clearTimeout(backTimer);
      if (save) {
        console.log("You need to remove event");
        try {
          const response = await fetch(
            `${PORT_API}/user/remove-event?idEvent=${id}`,
            {
              method: "POST", // Adjust the method if necessary
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData?.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to remove event");
          }
          // Handle success
          console.log("Event removed successfully");
          setSave(false);
          updateSavedEvent();
        } catch (error) {
          // Handle errors
          console.error("Error removing event:", error.message);
        }
        setBackCount((prevCount) => prevCount + 1);
      }
    } else {
      console.log("you should save");
      try {
        const response = await fetch(
          `${PORT_API}/user/save-event?idEvent=${id}`,
          {
            method: "POST", // Adjust the method if necessary
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to save event");
        }
        // Handle success
        console.log("Event saved successfully");
        setSave(true);
        updateSavedEvent();
      } catch (error) {
        // Handle errors
        console.error("Error saving event:", error.message);
      }
      setBackCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <View style={{ backgroundColor: "#fff" }}>
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
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: userData?.email === event?.user?.email ? "100%" : "90%",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 40,
              right: 15,
              zIndex: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: Colors.WHITE, fontWeight: "500" }}>
              {status}
            </Text>
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
              <TouchableOpacity
                onPress={() => handleLocationPress(event?.place)}
              >
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
                borderWidth: 0.2,
                borderColor: Colors.GREY,
                // borderStyle: "dashed",
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
                  {formatTime(event?.time_start)} -{" "}
                  {formatTime(event?.time_end)}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.2,
                borderColor: Colors.GREY,
                // borderStyle: "dashed",
                marginVertical: 10,
              }}
            ></View>

            <EventDescription event={event} />

            <View
              style={{
                borderWidth: 0.2,
                borderColor: Colors.GREY,
                // borderStyle: "dashed",
                marginVertical: 10,
              }}
            ></View>

            <EventPhotos event={event} />

            <View
              style={{
                borderWidth: 0.2,
                borderColor: Colors.GREY,
                // borderStyle: "dashed",
                marginVertical: 10,
              }}
            ></View>
            {status === "Ended" && <CreateComment eventId={event?.id} />}
          </View>
        </ScrollView>
        {userData?.email === event?.user?.email ? (
          ""
        ) : (
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 5,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => handleShare(event?.title, event?.image1)}
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
              onPress={() => saveEvent(event?.id)}
              style={{
                padding: 18,
                borderRadius: 100,
                backgroundColor: save ? Colors.PRIMARY : "#e8ebfd",
                marginRight: 15,
              }}
            >
              <Feather
                name="bookmark"
                size={30}
                color={save ? "#e8ebfd" : Colors.PRIMARY}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleJoinNow}
              disabled={loading}
              style={{
                paddingVertical: 12,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 50,
                flex: 1,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                elevation: 6,
                pointerEvents:
                  isUserJoined || status === "Ended" || status === "Ongoing"
                    ? "none"
                    : "auto",
                opacity:
                  isUserJoined || status === "Ended" || status === "Ongoing"
                    ? 0.5
                    : 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "400",
                }}
              >
                {isUserJoined ? (
                  "Joined"
                ) : loading ? (
                  <ActivityIndicator size="small" color="#00ff00" />
                ) : (
                  "Join Now"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Modal content */}
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={successIcon} style={{ width: 130, height: 130 }} />
              <Text
                style={{
                  fontSize: 25,
                  marginTop: 20,
                  marginBottom: 10,
                  fontWeight: "500",
                }}
              >
                Thank you
              </Text>
              <Text style={{ fontSize: 20, marginBottom: 50 }}>
                Participate in the event successfully
              </Text>
              <TouchableOpacity
                onPress={hideModal}
                style={{
                  padding: 10,
                  backgroundColor: Colors.PRIMARY,
                  borderRadius: 50,
                  width: "100%",
                  marginHorizontal: 20,
                  textAlign: "center",
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
