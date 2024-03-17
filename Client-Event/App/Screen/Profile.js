import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../Utils/Colors";
import { EvilIcons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PORT_API } from "../Utils/Config";
import { useUserLogin } from '../Context/context';
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";


const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function Profile({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFullName, setModalFullNameVisible] = useState(false);
  const [modalPassWord, setModalPassWordVisible] = useState(false);
  const [fullNameValue, setFullNameValue] = useState('');
  const [oldPasswordValue, setOldPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmNewPasswordValue, setConfirmNewPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState()

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false)
  const { saveUserData, userData, updateUserAvatar, updateUserName } = useUserLogin();



  const selectImage = async (useLibrary) => {
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
    closeModal()
  };
  useEffect(() => {
    if (images.length > 0) {
      const uploadImage = async () => {
        try {
          const formData = new FormData();
          const uriParts = images[images.length - 1].split(".");
          const fileType = uriParts[uriParts.length - 1];
          setLoading(true)
          formData.append("avatar", {
            uri: images[images.length - 1],
            name: `photo.${ fileType }`,
            type: `image/${ fileType }`,
          });
          formData.append("email", userData?.email);

          const response = await fetch(`${ PORT_API }/user/upload`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${ userData?.token }`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          console.log("Change avatar successfully", result);
          await Promise.all(
            images.map(async (image) => {
              await FileSystem.deleteAsync(image);
            })
          );
          // console.log('updateUserAvatar', updateUserAvatar(result?.user.avatar))
          updateUserAvatar(result?.user.avatar);
          const storedDataString = await AsyncStorage.getItem("userData");
          let storedData = storedDataString ? JSON.parse(storedDataString) : {};
          storedData.avatar = result?.user?.avatar;
          await AsyncStorage.setItem("userData", JSON.stringify(storedData));
          console.log("Avatar updated successfully!");
        } catch (error) {
          console.log("Fail", error);
        } finally {
          setLoading(false)
          setImages([])
        }
      };
      uploadImage();
    }
  }, [images]);

  const closeModal = () => {
    setModalVisible(false);
  };
  const closeModalFullName = () => {
    setModalFullNameVisible(false);
  };
  const closeModalPassWord = () => {
    setModalPassWordVisible(false);
  };
  const changeFullNameUser = async (fullNameValue) => {
    try {
      if (fullNameValue) {
        const response = await fetch(`${ PORT_API }/user/${ userData?.email }`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ userData?.token }`,
          },
          body: JSON.stringify({
            fullName: fullNameValue
          }),
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log("Change fullName successfully:", responseData);
          console.log('updateUserFullName')
          updateUserName(fullNameValue);
          const storedDataString = await AsyncStorage.getItem("userData");
          let storedData = storedDataString ? JSON.parse(storedDataString) : {};
          console.log('storedData', storedData)
          storedData.fullName = fullNameValue;
          await AsyncStorage.setItem("userData", JSON.stringify(storedData));
          setModalFullNameVisible(false)
        } else {
          const errorData = await response.json();
          alert("Change fullName failed:", errorData.error);
        }
      }
    } catch (err) {
      alert(err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setLoading(false);
    }
    setModalFullNameVisible(false)
  }
  const validatePassword = () => {
    return newPasswordValue === confirmNewPasswordValue;
  };
  const checkConditionForPassword = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const minLength = 8;

    // Check if password meets all criteria
    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const isLongEnough = password.length >= minLength;

    return hasUppercase && hasLowercase && hasNumber && isLongEnough;
  }

  const changePassWordUser = async () => {
    const pattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d.@#$%^&*!]{8,}$/;

    console.log(newPasswordValue)
    if (!pattern.test(newPasswordValue)) {
      setError('New password must be at least 8 characters, 1 number and 1 capital letter')
      return
    }
    try {
      if (!oldPasswordValue || !newPasswordValue || !confirmNewPasswordValue) {
        setError("Please fill in all fields.");
        return;
      }
      if (!validatePassword()) {
        setError("New password and confirm password do not match.");
        return;
      }
      if (!pattern.test(newPasswordValue)) {
        setError('New password must be at least 8 characters, 1 number and 1 capital letter')
        return
      }
      setLoading(true)
      const response = await fetch(`${ PORT_API }/user/change-password/${ userData?.email }`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ userData?.token }`,
        },
        body: JSON.stringify({
          oldPassword: oldPasswordValue,
          newPassword: newPasswordValue
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        console.log("Password changed successfully:", responseData);

        setOldPasswordValue('');
        setNewPasswordValue('');
        setConfirmNewPasswordValue('');
        // Optionally, close the modal after successful password change
        setModalPassWordVisible(false);
      } else {
        const errorData = await response.json();
        alert("Please check your old password", errorData.error);
      }
    } catch (err) {
      alert(err.message); // Assuming `err` has a `message` property
    } finally {
      setLoading(false);
    }

  }
  const tokenFake = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5raHVuZzU1NTU1NUBnbWFpbC5jb20iLCJpYXQiOjE3MDk4MjUxMDksImV4cCI6MTcxMDQyOTkwOX0.JWDv8BmbCLXUtpOMRDpCHp9hzli_J0pceoaPfe90Q5U'
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
      // navigation.navigate("login")
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
      console.error("Error deleting data:", error);
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <View style={{
        marginTop: 10,
        marginLeft: 10, marginBottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text style={{ fontSize: 25, fontWeight: "700", color: Colors.PRIMARY }}>Profile</Text>
        <TouchableOpacity style={{ marginTop: 8 }} onPress={logOut}>
          <MaterialIcons name="logout" size={30} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'relative', width: 150, height: 150 }}>
          {loading ? <ActivityIndicator size="large" color="#00ff00" /> : (
            <Image key={new Date().getTime()} source={{ uri: userData?.avatar }} style={{ width: 150, height: 150, borderRadius: 100 }} />
          )}
          <EvilIcons name="pencil" size={45} color={Colors.PRIMARY}
            style={{ position: 'absolute', bottom: 0, right: 0 }} />
        </TouchableOpacity>
        <Text style={{ marginTop: 16, fontFamily: 'appFont-semi', fontSize: 23 }}>{userData?.fullName}</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontFamily: 'appFont-semi', fontSize: 22 }}>Edit Profile</Text>
        <View style={{ marginTop: 20, gap: 20 }}>
          <View style={{
            shadowColor: '#52006A',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              borderRadius: 8,
            }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontFamily: 'appFont-medium', fontSize: 20 }}>Email</Text>
                <Text style={{ fontSize: 18, color: '#8b8b8b', fontWeight: '600' }}>{userData?.email}</Text>
              </View>
            </View>
          </View>
          <View style={{
            shadowColor: '#52006A',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}>
            <TouchableOpacity onPress={() => setModalFullNameVisible(true)} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              borderRadius: 8,
            }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontFamily: 'appFont-medium', fontSize: 20 }}>Full Name</Text>
                <Text style={{ fontSize: 18, color: '#8b8b8b', fontWeight: '600' }}>{userData?.fullName}</Text>
              </View>
              <EvilIcons name="pencil" size={42} color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>

          <View style={{
            shadowColor: '#52006A',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}>
            <TouchableOpacity onPress={() => setModalPassWordVisible(true)} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              borderRadius: 8,
            }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontFamily: 'appFont-medium', fontSize: 20 }}>Password</Text>
                <Text style={{ fontSize: 18, color: '#8b8b8b', fontWeight: '600' }}>***********</Text>
              </View>
              <EvilIcons name="pencil" size={42} color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>

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
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalFullName}
          onRequestClose={closeModalFullName}
        >
          <TouchableWithoutFeedback onPress={closeModalFullName}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={{ fontSize: 22, fontWeight: "bold", paddingVertical: 20, textTransform: 'uppercase' }}>
                    Change Full Name
                  </Text>
                  <View style={{
                    width: '100%',
                    marginTop: 20,
                    paddingVertical: 15,
                    paddingHorizontal: 8,
                    shadowColor: '#52006A',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                  }}>
                    <TextInput
                      placeholder="Change your full name"
                      value={fullNameValue}
                      onChangeText={text => setFullNameValue(text)}
                      style={{ fontSize: 18, fontWeight: '700' }}
                    />
                  </View>
                  <View style={{
                    flexDirection: 'row', gap: 10,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                    marginTop: 25
                  }}>
                    <TouchableOpacity onPress={() => changeFullNameUser(fullNameValue)} style={{
                      borderRadius: 50,
                      paddingVertical: 10, paddingHorizontal: 5, backgroundColor: Colors.PRIMARY,
                      width: '50%'
                    }}>
                      <Text style={{
                        color: '#fff'
                        , fontSize: 20,
                        fontWeight: '500',
                        textAlign: 'center',

                      }}>Ok</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalFullNameVisible(false)} style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: '#fff',
                      shadowColor: '#52006A',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      width: '50%',
                      textAlign: 'center'
                    }}>
                      <Text style={{
                        color: Colors.PRIMARY,
                        textAlign: 'center',
                        fontSize: 20, fontWeight: '500'
                      }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal >
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalPassWord}
          onRequestClose={closeModalPassWord}
        >
          <TouchableWithoutFeedback onPress={closeModalPassWord}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={{ fontSize: 22, fontWeight: "bold", paddingVertical: 20, textTransform: 'uppercase' }}>
                    Change Your Password
                  </Text>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    paddingVertical: 18,
                    paddingHorizontal: 10,
                    shadowColor: '#52006A',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                  }}>
                    <TextInput
                      placeholder="Old Password"
                      value={oldPasswordValue}
                      autoCapitalize='none'
                      secureTextEntry={!showPassword}
                      onChangeText={text => setOldPasswordValue(text)}
                      style={{ fontSize: 18, fontWeight: '600', textTransform: 'none', flex: 1 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                      paddingVertical: 18,
                      paddingHorizontal: 10,
                      shadowColor: '#52006A',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                    }}>
                    <TextInput
                      placeholder="New Password"
                      autoCapitalize='none'
                      value={newPasswordValue}
                      secureTextEntry={!showPassword}
                      onChangeText={text => setNewPasswordValue(text)}
                      style={{ fontSize: 18, fontWeight: '600', flex: 1 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 18,
                      paddingHorizontal: 10,
                      shadowColor: '#52006A',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                    }}>
                    <TextInput
                      placeholder="Confirm Password"
                      value={confirmNewPasswordValue}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                      onChangeText={text => setConfirmNewPasswordValue(text)}
                      style={{ fontSize: 18, fontWeight: '600', flex: 1 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: '700', fontSize: 18, color: 'red' }}>{error ? error : ''}</Text>
                  </View>
                  <View style={{
                    flexDirection: 'row', gap: 10,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                    marginTop: 25
                  }}>
                    <TouchableOpacity onPress={changePassWordUser} style={{
                      borderRadius: 50,
                      paddingVertical: 10, paddingHorizontal: 5, backgroundColor: Colors.PRIMARY,
                      width: '50%',
                      opacity: loading ? 0.5 : 1,
                      pointerEvents: loading ? "none" : "",
                    }}>
                      <Text style={{
                        color: '#fff'
                        , fontSize: 20,
                        fontWeight: '500',
                        textAlign: 'center',

                      }}>{loading ? <ActivityIndicator size="large" color="#00ff00" /> : 'Ok'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalPassWordVisible(false)} style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: '#fff',
                      shadowColor: '#52006A',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      width: '50%',
                      textAlign: 'center'
                    }}>
                      <Text style={{
                        color: Colors.PRIMARY,
                        textAlign: 'center',
                        fontSize: 20, fontWeight: '500'
                      }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal >
      </View >
      {/* <Button
        title="Sign Out"
        
      /> */}
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    textAlign: "center",
    alignItems: "center",
  },
});