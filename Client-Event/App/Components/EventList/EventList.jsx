import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PORT_API } from "../../Utils/Config";
import imgDemo from "../../../assets/images/original.jpg";
import Colors from "../../Utils/Colors";
import EventListItem from "./EventListItem";
export default function EventList() {
  const [eventLists, setEventLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(eventLists);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${PORT_API}/api/v1/event/all-events`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setEventLists(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={{ marginTop: 20, paddingBottom: 100 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : (
        <FlatList
          data={eventLists}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) =>
            index < 7 && (
              <View style={{ marginRight: 10 }}>
                <EventListItem event={item} />
              </View>
            )
          }
          contentContainerStyle={{ alignItems: "center" }}
        />
      )}
    </View>
  );
}
