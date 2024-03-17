import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import Slider from "../Components/Slider";
import { PORT_API } from "../Utils/Config";
import { useEffect, useState } from "react";
import Categories from "../Components/Categories";
import EventList from "../Components/EventList/EventList";
import Heading from "../common/Heading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrendingEvent from "../Components/TrendingEvent/TrendingEvent";
import { useUserLogin } from "../Context/context";
import Colors from "../Utils/Colors";
const CourseListScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  // const { user } = useUser();
  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  // const removeUserData = async () => {
  //   try {
  //     await AsyncStorage.removeItem("userData");
  //     console.log("UserData removed successfully");
  //   } catch (error) {
  //     console.error("Error removing UserData:", error);
  //   }
  // };
  // const checkTokenValid = async () => {
  //   try {
  //     // const userDataString = await AsyncStorage.getItem("userData");
  //     if (userData !== null) {
  //       // Data found, parse it to JSON
  //       // const userData = JSON.parse(userDataString);
  //       const token = userData?.token;
  //       const response = await fetch(`${ PORT_API }/user/get-info`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${ token }`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       // Check if the response is successful
  //       if (response.ok) {
  //         console.log("Token is valid");
  //       } else {
  //         console.error("Failed to fetch user info:", response.status);
  //         // setInfoUser(null);
  //         removeUserData();
  //         // navigation.navigate('login')
  //         updateUserAvatar()
  //       }
  //     } else {
  //       console.log("No data found in local storage.");
  //       // setInfoUser(null);
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving data:", error);
  //     // setUserInfo(null);
  //   }
  // };

  // useEffect(() => {
  //   checkTokenValid()
  // }, [userData])


  return (
    <View style={{ paddingTop: 40, padding: 20, backgroundColor: '#fff', flex: 1, paddingLeft: 10 }}>
      <Header userData={userData} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ marginVertical: 20, fontSize: 21, fontWeight: "700", color: Colors.PRIMARY }}>Popular Event</Text>
        <TrendingEvent />
        <Heading title={"Categories"} viewAll={true} />
        <Categories onCategoryPress={handleCategoryPress} />
        <EventList selectedCategory={selectedCategory?.typeOfEvent} viewAll={false} />
      </ScrollView>
    </View>
  );
};

export default CourseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});