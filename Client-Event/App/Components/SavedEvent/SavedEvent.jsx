import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import { PORT_API } from "../../Utils/Config";
import { useUserLogin } from "../../Context/context";
import AllEventListItem from "../AllEvent/AllEventListItem";
import { useEventContext } from "../../Context/SaveContext";

export default function SavedEvent({ navigation }) {
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const { savedEventUpdated, updateSavedEvent, joinEventUpdate } =
    useEventContext();
  const [loading, setLoading] = useState(false);
  const [allSavedEvent, setAllSavedEvent] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const takeAllSaveEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${PORT_API}/user/all-event-saved`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 400) {
            setError(true);
          } else {
            throw new Error("Can't take event");
          }
        }
        // Handle success
        console.log("Take Saved Event successfully");
        const jsonData = await response.json();
        console.log("all save", jsonData);
        if ((jsonData ?? []).length <= 0) {
          setError(true);
        }
        setAllSavedEvent(jsonData);
      } catch (error) {
        // Handle errors
        console.error("Error saving event:", error.message);
      } finally {
        setLoading(false);
      }
    };

    takeAllSaveEvent();
  }, [savedEventUpdated, joinEventUpdate]);
  return (
    <View style={{ padding: 10 }}>
      <View>
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
            Saved List
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "80%", marginTop: 120 }}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color="blue" />
        ) : error ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: Colors.PRIMARY,
              fontWeight: "600",
              marginTop: 30,
            }}
          >
            There are no events saved
          </Text>
        ) : (
          <View>
            {(allSavedEvent.length > 0 ? allSavedEvent : []).map(
              (item, index) => (
                <AllEventListItem key={item.id.toString()} event={item} />
              )
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtnContainer: {
    position: "absolute",
    top: 30,
    left: 0,
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
