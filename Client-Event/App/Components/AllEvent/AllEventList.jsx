import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import nightlife from "../../../assets/images/nightlife.png";
import Colors from "../../Utils/Colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import AllEventListItem from "./AllEventListItem";
import { PORT_API } from "../../Utils/Config";
import { useUserLogin } from "../../Context/context";
import { useEventContext } from "../../Context/SaveContext";

export default function AllEventList({ selectedCategory, searchText, token }) {
  const [eventList, setEventList] = useState([]);
  const [filterAllEventList, setFilterAllEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
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
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setEventList(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userData, createEventUpdate, joinEventUpdate]);
  useEffect(() => {
    if (selectedCategory) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${PORT_API}/api/v1/event/filter?email=${userData?.email}&category=${selectedCategory}&statusCode=1`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
            setFilterAllEventList(jsonData);
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
  useEffect(() => {
    if (searchText) {
      console.log("true");
      const fetchData = async () => {
        console.log(
          `${PORT_API}/api/v1/event/search?email=${userData?.email}&title=${searchText}&statusCode=1`
        );
        try {
          setIsLoading(true);
          const response = await fetch(
            `${PORT_API}/api/v1/event/search?email=${userData?.email}&title=${searchText}&statusCode=1`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            if (response.status === 400) {
              setHasError(true);
              return;
            } else {
              throw new Error("Network response was not ok");
            }
          } else {
            const jsonData = await response.json();
            console.log(jsonData);
            setFilterAllEventList(jsonData);
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
  }, [searchText]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ height: "62%", marginTop: 20 }}
    >
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : hasError ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: Colors.PRIMARY,
            fontWeight: "600",
            marginTop: 30,
          }}
        >
          There are no events available
        </Text>
      ) : (
        <View>
          {(filterAllEventList.length > 0 ? filterAllEventList : eventList).map(
            (item, index) => (
              <AllEventListItem key={item.id.toString()} event={item} />
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}
