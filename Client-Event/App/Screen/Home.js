import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import Slider from "../Components/Slider";
import { PORT_API } from "../Utils/Config";
import { useEffect, useState } from "react";
import Categories from "../Components/Categories";
import EventList from "../Components/EventList/EventList";
import musicIcon from "../../assets/images/music.png"
import nightlife from "../../assets/images/nightlife.png"
import performing from "../../assets/images/performing.png"
import business from "../../assets/images/business.png"



const CourseListScreen = () => {
  return (
    <View style={{ paddingTop: 40, padding: 20, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar setSearchText={(value) => console.log(value)} />
        <Slider />
        <Categories />
        <EventList />
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