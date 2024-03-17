import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { Ionicons, Feather, EvilIcons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import Colors from '../Utils/Colors';
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomModal from '../common/CustomModal';
import { PORT_API } from '../Utils/Config';
import { useUserLogin } from '../Context/context';
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Header({ userData }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation()
    const { saveUserData } = useUserLogin();

    const onClose = () => {
        setIsModalVisible(false)
    }

    const logOut = async () => {
        try {
            const response = await fetch(`${ PORT_API }/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ userData?.token }`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to log out");
            }
            await AsyncStorage.removeItem("userData");
            console.log("Data deleted successfully!");
            saveUserData(null)
            Toast.show({
                type: "tomatoToast",
                text1: "Log out successfully!",
                visibilityTime: 3000,
                autoHide: true,
                swipeable: true,
            });
        }
        catch (error) {
            console.error("Error log out data:", error);
        }
    }
    const cleanedFullName = userData?.fullName.replace(/\s+/g, ' ').trim();
    return (
        <View>
            <View style={{ display: 'flex' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                            <EvilIcons name="navicon" size={30} color={Colors.PRIMARY} />
                        </TouchableOpacity>
                        <Image source={{ uri: userData?.avatar }} style={{ width: 45, height: 45, borderRadius: 99 }} />
                        <View>
                            <Text style={{ fontFamily: 'appFont' }}>Welcome, 👋</Text>
                            <Text style={{ fontFamily: 'appFont-bold', fontSize: 18, fontWeight: 'bold' }}>{cleanedFullName}</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Events")}>
                            <Ionicons name="search-sharp" size={30} color={Colors.PRIMARY} />
                        </TouchableOpacity>
                        <Ionicons name='notifications' size={30} color={Colors.PRIMARY} />
                    </View>
                </View>

            </View >
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={onClose}
            >
                <TouchableOpacity style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose}>
                        <View
                            style={{
                                width: "70%",
                            }}
                        >
                            <View
                                style={{ backgroundColor: "#fff", padding: 20, height: "100%" }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Home")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingBottom: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <AntDesign name="home" size={24} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Home
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Events")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <MaterialIcons
                                        name="event"
                                        size={24}
                                        color={Colors.PRIMARY}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Event List
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Create Event")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <AntDesign name="addfile" size={24} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Add Event
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("event-around")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <FontAwesome
                                        name="map-marker"
                                        size={30}
                                        color={Colors.PRIMARY}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                            marginLeft: 7,
                                        }}
                                    >
                                        Events Around
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("save-event")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <Feather name="bookmark" size={24} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Saved
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("available-event")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <MaterialIcons name="event-available" size={24} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        My Event
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("statistic-event")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <EvilIcons name="chart" size={30} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                            marginLeft: -3,
                                        }}
                                    >
                                        Statistic
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("My Profile")}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <FontAwesome name="user" size={24} color={Colors.PRIMARY} />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                            marginLeft: 8,
                                        }}
                                    >
                                        Profile
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        logOut()
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                        borderBottomWidth: 0.5,
                                        borderColor: "#06bcee",
                                        // borderStyle: "dashed",
                                        gap: 20,
                                    }}
                                >
                                    <MaterialIcons
                                        name="logout"
                                        size={24}
                                        color={Colors.PRIMARY}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            color: "#3a3a3a",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Logout
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                </TouchableOpacity> */}
            </Modal>
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