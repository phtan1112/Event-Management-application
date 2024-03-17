import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  Ionicons,
  Feather,
  EvilIcons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import Colors from "../Utils/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CustomModal({ isVisible, onClose }) {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose}>
            <View
              style={{
                // flex: 1,
                // position: "absolute",
                // top: 0,
                // left: 0,
                // bottom: 0,
                width: "70%",
                zIndex: 6,
              }}
            >
              <View
                style={{ backgroundColor: "#fff", padding: 20, height: "100%" }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingBottom: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    // borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <AntDesign name="home" size={24} color={Colors.PRIMARY} />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                    }}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Events")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <MaterialIcons
                    name="event"
                    size={24}
                    color={Colors.PRIMARY}
                  />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                    }}
                  >
                    Event List
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Create Event")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <AntDesign name="addfile" size={24} color={Colors.PRIMARY} />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                    }}
                  >
                    Add Event
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("event-around")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <FontAwesome
                    name="map-marker"
                    size={30}
                    color={Colors.PRIMARY}
                  />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                      marginLeft: 7,
                    }}
                  >
                    Events Around
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("My Profile")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <FontAwesome name="user" size={24} color={Colors.PRIMARY} />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                      marginLeft: 8,
                    }}
                  >
                    Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    signOut();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: "#06bcee",
                    borderStyle: "dashed",
                    gap: 20,
                  }}
                >
                  <MaterialIcons
                    name="logout"
                    size={24}
                    color={Colors.PRIMARY}
                  />
                  <Text
                    style={{
                      fontSize: 19,
                      color: "#3a3a3a",
                      fontWeight: "500",
                    }}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    textAlign: "center",
    alignItems: "center",
  },
});
