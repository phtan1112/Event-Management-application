import { View, Text, FlatList, Image } from "react-native";
import React from "react";

export default function EventPhotos({ event }) {
  const images = [event?.image2, event?.image3, event?.image3];
  return (
    <View>
      <Text
        style={{ fontSize: 20, fontFamily: "appFont-semi", marginBottom: 10 }}
      >
        Related Photos
      </Text>
      <FlatList
        data={images}
        numColumns={2}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: "100%",
              flex: 1,
              height: 120,
              borderRadius: 15,
              margin: 7,
            }}
          />
        )}
      />
    </View>
  );
}
