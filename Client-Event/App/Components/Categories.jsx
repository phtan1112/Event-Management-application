import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PORT_API } from "../Utils/Config";
import Colors from "../Utils/Colors";

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(categories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/category/all-categories`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setCategories(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={{ marginTop: 20 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : (
        <FlatList
          data={categories}
          numColumns={4}
          renderItem={({ item, index }) =>
            index <= 3 && (
              <TouchableOpacity style={styles.container}>
                <View style={styles.iconContainer}>
                  <Image
                    source={{ uri: item?.thumbnail }}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
                <Text style={{ fontFamily: "appFont-semi", marginTop: 5 }}>
                  {item?.typeOfEvent}
                </Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.WHITE,
    padding: 17,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#eaeeff",
  },
});
