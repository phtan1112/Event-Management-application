import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Utils/Colors'
import SearchBar from '../Components/SearchBar'
import Categories from '../Components/Categories';
import AllEventList from '../Components/AllEvent/AllEventList';
import { Ionicons, Feather, EvilIcons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';

import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import { useUserLogin } from '../Context/context';

export default function Event({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, updateUserAvatar } = useUserLogin();
  const toggleModal = () => {
    setIsModalVisible(false);
  }
  console.log(searchText)

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={{ padding: 5, backgroundColor: '#fff', flex: 1 }}>
      <View style={{
        marginTop: 30, marginLeft: 20, marginBottom: 10,
        flexDirection: 'row', alignItems: 'center', gap: 5
      }}>
        <Text style={{ fontSize: 25, fontWeight: "700", color: Colors.PRIMARY }}>Event</Text>
      </View>
      <View style={{ marginHorizontal: 5, marginVertical: 16 }}>
        <SearchBar setSearchText={setSearchText} />
        <Categories onCategoryPress={handleCategoryPress} viewAll={true} />
        <AllEventList selectedCategory={selectedCategory?.typeOfEvent} searchText={searchText} token={userData?.token} />
      </View>
    </View>
  )
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