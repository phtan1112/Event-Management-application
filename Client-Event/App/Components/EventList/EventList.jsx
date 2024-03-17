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
import { useUserLogin } from "../../Context/context";
import { useEventContext } from "../../Context/SaveContext";

export default function EventList({ selectedCategory }) {
  console.log(selectedCategory);
  const [eventLists, setEventLists] = useState([]);
  // console.log("event", eventLists);
  const [filterEventLists, setFilterEventLists] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const { createEventUpdate, joinEventUpdate } = useEventContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/event/all-events?statusCode=1`
        );
        if (!response.ok) {
          if (response.status === 400) {
            // Handle bad request
            const jsonData = await response.json();
            console.log(jsonData);
            setHasError(true);
            setEventLists([]);
          } else {
            // Handle other error statuses
            throw new Error("Network response was not ok");
          }
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
  }, [createEventUpdate, userData, joinEventUpdate]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${PORT_API}/api/v1/event/filter?email=${userData?.email}&category=${selectedCategory}&statusCode=1`,
            {
              headers: {
                Authorization: `Bearer ${userData?.token}`,
              },
            }
          );
          if (!response.ok) {
            if (response.status === 400) {
              setHasError(true);
            } else {
              throw new Error("Network response was not ok");
            }
          } else {
            const jsonData = await response.json();
            setFilterEventLists(jsonData);
            setHasError(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedCategory]);

  return (
    <View style={{ marginTop: 20 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : hasError ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: Colors.PRIMARY,
            fontWeight: "600",
          }}
        >
          There are no events available
        </Text>
      ) : (
        <FlatList
          data={filterEventLists.length > 0 ? filterEventLists : eventLists}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) =>
            index < 7 && (
              <View
                style={{
                  marginRight: 10,
                }}
              >
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
