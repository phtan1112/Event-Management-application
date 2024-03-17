import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { PORT_API } from "../../Utils/Config";
import TrendingEventItem from "./TrendingEventItem";
import { useUserLogin } from "../../Context/context";
import { useEventContext } from "../../Context/SaveContext";

export default function TrendingEvent() {
  const [currentPage, setCurrentPage] = useState(0);
  const [allTrendingEvent, setAllTrendingEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { saveUserData, userData, updateUserAvatar, updateUserName } =
    useUserLogin();
  const { createEventUpdate, joinEventUpdate, trendingEventUpdate } =
    useEventContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/event/all-events?statusCode=1`
        );
        if (!response.ok) {
          if (response.status === 400) {
            setAllTrendingEvent([]);
          } else {
            throw new Error("Network response was not ok");
          }
        }
        const jsonData = await response.json();
        const sortedEvents = jsonData.sort(
          (a, b) => b.numberOfParticipators - a.numberOfParticipators
        );
        const topEvents = sortedEvents.slice(0, 4);
        setAllTrendingEvent(topEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userData, createEventUpdate, joinEventUpdate, trendingEventUpdate]);

  const handlePagination = (index) => {
    setCurrentPage(index);
  };

  return (
    <View style={{ marginTop: 10 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : (
        <FlatList
          data={allTrendingEvent}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <TrendingEventItem trendingEvent={item} />}
          pagingEnabled
          onScroll={(event) => {
            const containerWidth = event.nativeEvent.layoutMeasurement.width;
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(contentOffsetX / containerWidth);
            setCurrentPage(index);
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {allTrendingEvent.length > 0 &&
          allTrendingEvent.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePagination(index)}
              style={{
                width: currentPage === index ? 14 : 10,
                height: currentPage === index ? 14 : 10,
                borderRadius: 10,
                backgroundColor:
                  currentPage === index ? Colors.PRIMARY : "gray",
                marginHorizontal: 15,
                marginVertical: 10,
                pointerEvents: "none",
              }}
            />
          ))}
      </View>
    </View>
  );
}
