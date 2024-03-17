import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  console.log("Context Data: ", userData);

  const retrieveDataFromLocalStorage = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        // Data found, parse it to JSON
        const userData = JSON.parse(userDataString);
        console.log("Context Data: ", userData);
        setUserData(userData);
      } else {
        console.log("No data found in local storage.");
        setInfoUser(null);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      setInfoUser(null);
    }
  };
  useEffect(() => {
    retrieveDataFromLocalStorage();
  }, []);
  const saveUserData = (data) => {
    setUserData(data);
  };
  const updateUserAvatar = (avatarUrl) => {
    setUserData({ ...userData, avatar: avatarUrl });
  };
  const updateUserName = (name) => {
    setUserData({ ...userData, fullName: name });
  };
  const saveInfoUser = (name) => {
    setInfoUser(name);
  };

  return (
    <UserContext.Provider
      value={{ saveUserData, userData, updateUserAvatar, updateUserName }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserLogin = () => useContext(UserContext);
