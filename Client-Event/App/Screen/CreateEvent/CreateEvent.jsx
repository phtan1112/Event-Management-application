import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from "expo-location";
import Colors from "../../Utils/Colors";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons, Feather, Entypo, AntDesign } from "@expo/vector-icons";
import locationIcon from "../../../assets/svg/location.svg";
import SvgUri from "react-native-svg-uri";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ImageItem from "./ImageItem";
import { PORT_API } from "../../Utils/Config";
import SuccessModal from "../../common/SuccessModal";
import Appointment from "../Appointment";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};
export default function CreateEvent() {
  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState(null);
  const [responData, setResponData] = useState([]);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [startMode, setStartMode] = useState("date");
  const [endMode, setEndMode] = useState("date");
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startButtonText, setStartButtonText] = useState("Pick a Date");
  const [endButtonText, setEndButtonText] = useState("Pick a Date");
  const [startTimeText, setStartTimeText] = useState("Pick a Time");
  const [endTimeText, setEndTimeText] = useState("Pick a Time");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState(null);
  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);

  // Update responData whenever categories changes
  useEffect(() => {
    if (categories) {
      const updatedResponData = categories.map((item) => ({
        label: item.typeOfEvent,
        value: item.typeOfEvent,
      }));
      setResponData(updatedResponData);
    }
  }, [categories]);
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:");
      console.log(currentLocation);
    };
    getPermissions();
  }, []);
  useEffect(() => {
    // reverseGeocode();
    geocode();
  });
  const geocode = async () => {
    try {
      if (typeof address === "string") {
        const geocodedLocation = await Location.geocodeAsync(address);

        // Check if geocodedLocation has latitude and longitude properties
        if (geocodedLocation && geocodedLocation.length > 0) {
          const { latitude, longitude } = geocodedLocation[0];

          // Check if latitude and longitude are valid numbers
          if (latitude && longitude) {
            setLatitude(latitude);
            setLongitude(longitude);

            // Perform reverse geocoding
            const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  };
  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: longitude,
      latitude: latitude,
    });

    console.log("Reverse Geocoded:");
    console.log(reverseGeocodedAddress);
  };
  const onStartChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowStart(false);
      return;
    }
    const currentDate = selectedDate || startDateTime;

    setShowStart(false);
    setStartDateTime(currentDate);
    setStartButtonText(convertDateFormat(currentDate.toLocaleDateString()));
    if (startMode === "time") {
      const startTime =
        new Date(startDateTime).getHours() * 60 +
        new Date(startDateTime).getMinutes();
      const endTime =
        new Date(currentDate).getHours() * 60 +
        new Date(currentDate).getMinutes();
      if (startTime < endTime + 30) {
        alert(
          "Warning: Start time should be at least 30 minutes after the end time."
        );
      } else {
        const formattedTime = convertToAMPM(currentDate.toLocaleTimeString());
        setStartTimeText(formattedTime);
      }
    }
  };

  const onEndChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowStart(false);
      return;
    }
    const currentDate = selectedDate || endDateTime;
    setShowEnd(false);
    setEndDateTime(currentDate);
    setEndButtonText(convertDateFormat(currentDate.toLocaleDateString()));
    if (endMode === "time") {
      const startTime =
        new Date(startDateTime).getHours() * 60 +
        new Date(startDateTime).getMinutes();
      const endTime =
        new Date(currentDate).getHours() * 60 +
        new Date(currentDate).getMinutes();
      if (endTime < startTime + 30) {
        alert(
          "Warning: End time should be at least 30 minutes after the start time."
        );
      } else {
        const formattedTime = convertToAMPM(currentDate.toLocaleTimeString());
        setEndTimeText(formattedTime);
      }
    }
  };

  const showStartMode = (currentMode) => {
    setShowStart(true);
    setStartMode(currentMode);
  };

  const showEndMode = (currentMode) => {
    setShowEnd(true);
    setEndMode(currentMode);
  };

  const showStartDatepicker = () => {
    showStartMode("date");
  };

  const showEndDatepicker = () => {
    showEndMode("date");
  };

  const showStartTimepicker = () => {
    showStartMode("time");
  };

  const showEndTimepicker = () => {
    showEndMode("time");
  };
  const renderLabel = () => {
    if (eventType || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Categories
        </Text>
      );
    }
    return null;
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };
  const selectImage = async (useLibrary) => {
    if (images.length >= 4) {
      alert("You can only choose up to 4 images.");
      return;
    }
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };
  const saveImage = async (uri) => {
    await ensureDirExists();
    const filename = new Date().getTime() + ".jpeg";
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };
  const deleteImage = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };
  function convertToAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    let formattedHours = date.getHours() % 12;
    formattedHours = formattedHours ? formattedHours : 12;
    const formattedMinutes = String(date.getMinutes()).padStart(2, "0");

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedTime;
  }
  function convertDateFormat(dateString) {
    const parts = dateString.split("/");

    // Rearrange the parts in the format "YYYY-MM-DD"
    const formattedDate = `${parts[2]}-${parts[1].padStart(
      2,
      "0"
    )}-${parts[0].padStart(2, "0")}`;

    return formattedDate;
  }
  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
  };
  const username = "tanphuocdt1@gmail.com";
  const password = "123456";
  const basicAuth = "Basic " + btoa(username + ":" + password);
  const addEventToBackend = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      images.forEach((image, index) => {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("images", {
          uri: image,
          name: `photo${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      // Append other form data fields
      formData.append("title", eventName);
      formData.append("typeEvent", eventType);
      formData.append("dateStart", startButtonText);
      formData.append("timeStart", startTimeText);
      formData.append("timeEnd", endTimeText);
      formData.append("description", note);
      formData.append("place", address);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      const response = await fetch(`${PORT_API}/api/v1/event/create`, {
        method: "POST",
        headers: {
          Authorization: basicAuth,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Event created successfully!", result);
      await Promise.all(
        images.map(async (image) => {
          await FileSystem.deleteAsync(image);
        })
      );
      setImages([]);
      setEventName("");
      setEventType(null);
      setAddress("");
      setStartButtonText("Pick a Date");
      setStartTimeText("Pick a Time");
      setEndTimeText("Pick a Time");
      setLatitude(null);
      setLongitude(null);
      setNote("");
      setSuccessModalVisible(true);
    } catch (error) {
      console.log("Fail", error);
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    if (images.length < 1) {
      Alert.alert("Error", "Please choose images");
      return false;
    }
    if (!eventName.trim()) {
      Alert.alert("Error", "Event Name is required.");
      return false;
    }
    if (!eventType) {
      Alert.alert("Error", "Event Type is required.");
      return false;
    }
    if (!startButtonText || startButtonText === "Pick a Date") {
      Alert.alert("Error", "Event Start Date is required.");
      return false;
    }

    if (!endButtonText || endButtonText === "Pick a Date") {
      Alert.alert("Error", "Event End Date is required.");
      return false;
    }
    if (!startTimeText || startTimeText === "Pick a Time") {
      Alert.alert("Error", "Event Start Time is required.");
      return false;
    }
    if (!endTimeText || endTimeText === "Pick a Time") {
      Alert.alert("Error", "Event Start Time is required.");
      return false;
    }
    if (!note) {
      Alert.alert("Error", "Note is required.");
      return false;
    }
    if (!address) {
      Alert.alert("Error", "Location is required");
      return false;
    }

    return true;
  };
  const handleConfirmAndBook = () => {
    if (validateForm()) {
      addEventToBackend();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <KeyboardAvoidingView>
        <Spinner visible={loading} />
        <SuccessModal
          visible={successModalVisible}
          onClose={handleCloseSuccessModal}
        />
        <View>
          <TouchableOpacity
            style={styles.imgContainer}
            onPress={() => setModalVisible(true)}
          >
            {images.length > 0 ? (
              <Image
                source={{ uri: images[0] }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
            ) : (
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>+</Text>
            )}
          </TouchableOpacity>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {[...Array(Math.max(4, images.length))].map((_, index) => (
              <ImageItem
                key={index}
                index={index}
                setModalVisible={setModalVisible}
                images={images}
                deleteImage={deleteImage}
              />
            ))}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                      Upload Photo
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        marginTop: 40,
                        flexDirection: "row",
                        gap: 10,
                        paddingHorizontal: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => selectImage(false)}
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          backgroundColor: "#e3e8f1",
                          borderRadius: 8,
                        }}
                      >
                        <Feather name="camera" size={24} color="#c8a466" />
                        <Text>Camera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => selectImage(true)}
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          backgroundColor: "#e3e8f1",
                          borderRadius: 8,
                        }}
                      >
                        <Entypo name="image" size={24} color="#c8a466" />
                        <Text>Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        <Text
          style={{
            color: Colors.PRIMARY,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Event Details
        </Text>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Event Name
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.BLACK,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              paddingLeft: 20,
            }}
          >
            <MaterialIcons
              name="drive-file-rename-outline"
              size={24}
              color="black"
            />
            <TextInput
              autoCapitalize="none"
              value={eventName}
              placeholder="Event Name"
              onChangeText={(eventName) => setEventName(eventName)}
              style={{
                width: "100%",
                marginLeft: 5,
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Location
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.BLACK,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              paddingLeft: 20,
            }}
          >
            <Entypo name="location" size={20} color="black" />
            <TextInput
              value={address}
              placeholder="Location"
              onChangeText={(location) => setAddress(location)}
              style={{
                width: "100%",
                marginLeft: 5,
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Event Type
          </Text>
          <View style={styles.containerDropdown}>
            {renderLabel()}
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={responData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Choose your category" : "..."}
              searchPlaceholder="Search..."
              value={eventType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setEventType(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <MaterialIcons
                  name="category"
                  size={24}
                  style={styles.icon}
                  color={isFocus ? Colors.PRIMARY : "black"}
                />
              )}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Event Start Date
          </Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={showStartDatepicker}
              style={styles.button}
            >
              <MaterialIcons name="event" size={30} color="#3498db" />
              <Text style={styles.buttonText}>{startButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showStartTimepicker}
              style={[styles.button, styles.timeButton]}
            >
              <MaterialIcons name="access-time" size={30} color="#2ecc71" />
              <Text style={styles.buttonText}>{startTimeText}</Text>
            </TouchableOpacity>

            {showStart && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={startDateTime}
                mode={startMode}
                is24Hour={true}
                onChange={onStartChange}
                minimumDate={Date.now()}
                textColor="#3498db" // Set text color
              />
            )}
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Event End Date
          </Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={showEndTimepicker}
              style={[
                styles.button,
                styles.timeButton,
                startTimeText === "Pick a Time" ||
                startButtonText === "Pick a Date"
                  ? { opacity: 0.2, pointerEvents: "none" }
                  : {},
              ]}
            >
              <MaterialIcons name="access-time" size={30} color="#2ecc71" />
              <Text style={styles.buttonText}>{endTimeText}</Text>
            </TouchableOpacity>

            {showEnd && (
              <DateTimePicker
                testID="endDateTimePicker"
                value={endDateTime}
                mode={endMode}
                is24Hour={true}
                onChange={onEndChange}
                minimumDate={startDateTime || Date.now()}
                textColor="#3498db"
              />
            )}
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              fontWeight: "600",
            }}
          >
            Description
          </Text>
          <TextInput
            placeholder="Note"
            numberOfLines={5}
            multiline={true}
            style={styles.noteTextArea}
            onChangeText={(note) => setNote(note)}
            defaultValue={note}
          />
        </View>
        <TouchableOpacity
          style={{ marginTop: 15, paddingBottom: 100 }}
          onPress={handleConfirmAndBook}
        >
          <Text style={styles.confirmBtn}>Create new event & Publish</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f2f0f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.GREY,
    borderStyle: "dashed",
    marginBottom: 30,
  },
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
  picker: {
    width: "100%",
    height: "100%",
    paddingLeft: 15,
  },
  containerDropdown: {
    marginTop: -13,
    marginBottom: -25,
    paddingVertical: 25,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 15,
    color: Colors.GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  noteTextArea: {
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: "top",
    padding: 20,
    fontSize: 16,
    fontFamily: "appFont",
    borderColor: Colors.PRIMARY_LIGHT,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 1,
    paddingTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    width: "48%",
  },
  timeButton: {
    // backgroundColor: "#ecf0f1",
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#2c3e50",
  },
  selectedText: {
    marginTop: 20,
    backgroundColor: "#3498db",
    padding: 20,
    color: "#fff",
    borderRadius: 10,
    fontSize: 16,
  },
  confirmBtn: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    padding: 13,
    borderRadius: 99,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
