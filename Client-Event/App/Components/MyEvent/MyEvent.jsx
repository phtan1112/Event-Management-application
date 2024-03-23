import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PORT_API } from "../../Utils/Config";
import { useUserLogin } from "../../Context/context";
import { LinearGradient } from "expo-linear-gradient";
import { EvilIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import joinIcon from "../../../assets/images/join.png";
import createIcon from "../../../assets/images/create.png";
import ListItemJoined from "./ListItemJoined";

export default function MyEvent() {
  const navigation = useNavigation();
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const [modalVisible, setModalVisible] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [myEvent, setMyEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(true);
  const [joined, setJoined] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDeleteEvent = (eventId) => {
    setEventIdToDelete(eventId);
    setModalVisible(true);
  };
  const handleCreate = () => {
    setCreated(true);
    setJoined(false);
  };
  const handleJoined = () => {
    setJoined(true);
    setCreated(false);
  };
  const deleteEvent = async () => {
    closeModal();

    try {
      setLoading(true);
      const response = await fetch(
        `${PORT_API}/api/v1/event/delete/${eventIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete events");
      }

      const eventData = await response.json();
      console.log("Delete success", eventData);
      setMyEvent(myEvent.filter((event) => event.id !== eventIdToDelete));
      setLoading(false);
      Toast.show({
        type: "tomatoToast",
        text1: "Event deleted successfully!",
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        swipeable: true,
      });
    } catch (error) {
      console.error("Error deleting events:", error.message);
    } finally {
    }
  };
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/event/all-event-user`,
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
        setError(false);
        setMyEvent(eventData);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getAllEvents();
  }, [userData.token]);
  console.log("myEvent", myEvent);
  return (
    <View style={{ paddingHorizontal: 15, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            gap: 10,
          }}
        >
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={() => navigation.goBack()}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#f58a6f",
                borderRadius: 100,
              }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 25, fontWeight: "600", color: "#3a3a3a" }}>
            My Event
          </Text>
        </View>
        <Image
          source={{ uri: userData?.avatar }}
          style={{ width: 45, height: 45, borderRadius: 100 }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: 10,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleCreate}
          style={{
            color: "#f58a6f",
            paddingVertical: 13,
            borderRadius: 10,
            // backgroundColor: Colors.PRIMARY,
            backgroundColor: "#e8ebfd",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            width: "50%",
            opacity: created ? 1 : 0.5,
            borderColor: created ? "#f58a6f" : "",
            borderWidth: created ? 1 : 0,
          }}
        >
          <Image
            source={createIcon}
            style={{ width: 30, height: 30, borderRadius: 100 }}
          />

          <Text
            style={{
              color: "#f58a6f",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Created
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleJoined}
          style={{
            paddingVertical: 13,
            borderRadius: 10,
            backgroundColor: "#e8ebfd",
            width: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            opacity: joined ? 1 : 0.5,
            borderColor: joined ? "#f58a6f" : "",
            borderWidth: joined ? 1 : 0,
          }}
        >
          <Image
            source={joinIcon}
            style={{ width: 30, height: 30, borderRadius: 100 }}
          />
          <Text
            style={{
              color: "#f58a6f",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Joined
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color="#f58a6f" />
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
      ) : created ? (
        <ScrollView>
          {myEvent.length > 0 && myEvent ? (
            myEvent?.map((event, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.push("event-detail", { event: event })
                }
                key={event.id}
                style={{
                  width: "100%",
                  height: 180,
                  backgroundColor: "#f58a6f",
                  borderRadius: 20,
                  marginTop: 20,
                  paddingLeft: 60,
                  position: "relative",
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
                    top: -5,
                    right: 0,
                    zIndex: 5,
                  }}
                >
                  <AntDesign name="delete" size={27} color="black" />
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
            ))
          ) : (
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
          )}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ListItemJoined />
        </ScrollView>
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
                  Are you sure you want to delete this event?
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
