import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserLogin } from "../../Context/context";
import Toast from "react-native-toast-message";
import { PORT_API } from "../../Utils/Config";

import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import backIcon from "../../../assets/images/back.png";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useEventContext } from "../../Context/SaveContext";

export default function ListItemJoined() {
  const navigation = useNavigation();
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const { joinEventUpdate, updateJoinEvent } = useEventContext();

  const [allEventJoined, setAllEventJoined] = useState([]);
  const [error, setError] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEventIdToDelete(eventId);
    setModalVisible(true);
  };
  const deleteEvent = async () => {
    closeModal();
    try {
      setLoading(true);
      const response = await fetch(
        `${PORT_API}/api/v1/event/remove-participator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            idEvent: eventIdToDelete,
            email: userData?.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete events");
      }

      const eventData = await response.json();
      console.log("Unjoin success", eventData);
      setAllEventJoined(
        allEventJoined.filter((event) => event.id !== eventIdToDelete)
      );
      setLoading(false);
      updateJoinEvent();
      Toast.show({
        type: "tomatoToast",
        text1: "You have left the event",
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        swipeable: true,
      });
    } catch (error) {
      console.error("Error unjoined events:", error.message);
    } finally {
    }
  };
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/user/all-events-participated`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            setError(true);
          } else {
            throw new Error("Can't take event");
          }
        }

        const eventData = await response.json();
        console.log("Event data:", eventData);
        setAllEventJoined(eventData);
        // Process the eventData further as needed
      } catch (error) {
        console.error("Error fetching events:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getAllEvents();
  }, [userData.token]);

  return (
    <View style={{ paddingBottom: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#f58a6f" />
      ) : error ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: "#f58a6f",
            fontWeight: "600",
            marginTop: 30,
          }}
        >
          There are no events available
        </Text>
      ) : (
        <View>
          {allEventJoined?.map((event, index) => (
            <TouchableOpacity
              onPress={() => navigation.push("event-detail", { event: event })}
              key={event.id}
              style={{
                width: "100%",
                height: 180,
                backgroundColor: "#f58a6f",
                borderRadius: 20,
                marginTop: 20,
                paddingLeft: 60,
                position: "relative",
                zIndex: 10,
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  top: 75,
                  left: -20,
                  fontSize: 25,
                  fontWeight: "600",
                  color: "#fff",
                  transform: [{ rotate: "90deg" }],
                }}
              >
                Discover
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteEvent(event?.id)}
                style={{
                  position: "absolute",
                  top: -15,
                  right: 0,
                  zIndex: 10,
                }}
              >
                <Image source={backIcon} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
              <LinearGradient
                colors={["#f5bea5", "#f0e5e1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bgLinear}
              >
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    {event?.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ marginBottom: 10, width: "90%" }}
                  >
                    {event?.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                      marginBottom: 15,
                    }}
                  >
                    <EvilIcons name="location" size={30} color="black" />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        width: "80%",
                      }}
                    >
                      {event?.place}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: -15,
                        alignItems: "center",
                      }}
                    >
                      {event.participators.map(
                        (participant, i) =>
                          i < 4 && (
                            <Image
                              key={i}
                              source={{ uri: participant?.avatar }}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 100,
                              }}
                            />
                          )
                      )}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: "500" }}>
                      {event?.numberOfParticipators} participant
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to unjoin this event?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 5,
                    marginTop: 25,
                  }}
                >
                  <TouchableOpacity
                    onPress={deleteEvent}
                    style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: "#f58a6f",
                      width: "50%",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Ok
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: "#fff",
                      shadowColor: "#52006A",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      width: "50%",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#f58a6f",
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "500",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  backBtnContainer: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 20,
  },
  bgLinear: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    textAlign: "center",
    alignItems: "center",
  },
});
