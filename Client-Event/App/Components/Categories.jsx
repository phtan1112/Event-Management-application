import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PORT_API } from "../Utils/Config";
import Colors from "../Utils/Colors";

export default function Categories({ onCategoryPress, viewAll }) {
  const [categories, setCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
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
  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    if (onCategoryPress) {
      onCategoryPress(category);
    }
  };
  return (
    <View style={{ marginTop: 20 }}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="blue" />
      ) : viewAll ? (
        <FlatList
          data={categories}
          // numColumns={4}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.container}
              onPress={() => handleCategoryPress(item)}
            >
              <View
                style={
                  activeCategory === item
                    ? styles.activeCategory
                    : styles.iconContainer
                }
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <Text style={{ fontFamily: "appFont-semi", marginTop: 5 }}>
                {item?.typeOfEvent}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={categories?.slice(0, 4)}
          numColumns={4}
          nestedScrollEnabled={true}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.container}
              onPress={() => handleCategoryPress(item)}
            >
              <View
                style={
                  activeCategory === item
                    ? styles.activeCategory
                    : styles.iconContainer
                }
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <Text style={{ fontFamily: "appFont-semi", marginTop: 5 }}>
                {item?.typeOfEvent}
              </Text>
            </TouchableOpacity>
          )}
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
  activeCategory: {
    backgroundColor: Colors.WHITE,
    padding: 17,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "red",
    elevation: 5,
  },
});
