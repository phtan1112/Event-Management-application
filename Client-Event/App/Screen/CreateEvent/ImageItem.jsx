import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";

export default function ImageItem({
  index,
  setModalVisible,
  images,
  deleteImage,
}) {
  return (
    <TouchableOpacity
      style={styles.subImgContainer}
      onPress={() => setModalVisible(true)}
    >
      {index < images.length ? (
        <>
          <Image
            source={{ uri: images[index] }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
          <TouchableOpacity
            onPress={() => deleteImage(images[index])}
            style={{
              position: "absolute",
              top: -10,
              right: -8,
            }}
          >
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>+</Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  subImgContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f2f0f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.GREY,
    borderStyle: "dashed",
  },
});
