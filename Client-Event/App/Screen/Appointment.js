import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Appointment() {
  const param = useRoute().params;
  const navigation = useNavigation();
  console.log(param)
  useEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, []);
  return (
    <View>
      <Text>Appointment</Text>
    </View>
  )
}