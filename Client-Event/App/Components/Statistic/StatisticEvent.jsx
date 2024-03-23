import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableOpacityBase,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  EvilIcons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import { useUserLogin } from "../../Context/context";
import createIcon from "../../../assets/images/create.png";
import Colors from "../../Utils/Colors";
import { PORT_API } from "../../Utils/Config";
import arrowIcon from "../../../assets/images/arrow-down.png";
import { LinearGradient } from "expo-linear-gradient";

const dateTypes = [
  { id: 1, label: "Today" },
  { id: 2, label: "Yesterday" },
  { id: 3, label: "Within 7 Days" },
  { id: 4, label: "This Month" },
];

export default function StatisticEvent() {
  const navigation = useNavigation();

  const { userData, updateUserAvatar, updateUserName } = useUserLogin();
  const [createdStas, setCreatedStas] = useState(true);
  const [ratingStas, setRatingStas] = useState(false);
  const [listEventRating, setListEventRating] = useState([]);
  const [listCreateEvent, setListCreateEvent] = useState([]);

  const [error, setError] = useState(false);
  const [errorCreate, setErrorCreate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [activeIndices, setActiveIndices] = useState(true);
  const [activeStars, setActiveStars] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [selectedDateType, setSelectedDateType] = useState(1);
  const [selectedDateTypeLabel, setSelectedDateTypeLabel] = useState(
    dateTypes.find((dateType) => dateType.id === 1)?.label ?? ""
  );
  const animatedValue = new Animated.Value(0);
  function _start() {
    const toValue = 60;
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }

  useEffect(() => {
    _start();
  }, [animatedValue]);

  const handleCreate = () => {
    setCreatedStas(true);
    setRatingStas(false);
  };
  const handleRatingStas = () => {
    setRatingStas(true);
    setCreatedStas(false);
  };
  const toggleStar = (index) => {
    const updatedStars = activeStars.map((_, i) => i === index);
    setActiveStars(updatedStars);
    handleSubmitRating(updatedStars);
  };
  const handleSubmitRating = async (updatedStars) => {
    const activeStarIndices = updatedStars
      .map((star, index) => {
        if (star) {
          return index;
        }
      })
      .filter((index) => index !== undefined);
    if (activeStarIndices) {
      console.log(activeStarIndices[0] + 1);
      // console.log("true");
      setActiveIndices(false);
      console.log(activeIndices);
      try {
        setLoading(true);
        const response = await fetch(
          `${PORT_API}/api/v1/event/view-event?statusCode=3&star=${
            activeStarIndices[0] + 1
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            setListEventRating([]);
            setError(true);
            return;
          } else {
            throw new Error("Failed take out data");
          }
        }

        const jsonData = await response.json();
        setListEventRating(jsonData);
        setError(false);
        console.log(jsonData);
      } catch (error) {
        console.error("Error take data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDateTypeSelection = async (dateTypeId) => {
    console.log(selectedDateType);
    // setSelectedDateTypeLabel(
    //   dateTypes.find((dateType) => dateType.id === dateTypeId)?.label ?? ""
    // );
    // console.log("selectedDateType", selectedDateTypeLabel);
    try {
      setLoading(true);
      const response = await fetch(
        `${PORT_API}/api/v1/event/view-event?statusCode=1&typeOfDate=${selectedDateType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          setListCreateEvent([]);
          setErrorCreate(true);
          return;
        } else {
          throw new Error("Failed take out data");
        }
      }

      const jsonData = await response.json();
      setListCreateEvent(jsonData);
      setErrorCreate(false);
      console.log(jsonData);
    } catch (error) {
      console.error("Error take data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleDateTypeSelection(selectedDateType);
  }, [selectedDateType]);
  return (
    <View style={{ paddingHorizontal: 15, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            gap: 10,
          }}
        >
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={() => navigation.goBack()}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#f58a6f",
                borderRadius: 100,
              }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 25, fontWeight: "600", color: "#3a3a3a" }}>
            Statistic
          </Text>
        </View>
        <Image
          source={{ uri: userData?.avatar }}
          style={{ width: 45, height: 45, borderRadius: 100 }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: 10,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleCreate}
          style={{
            color: "#f58a6f",
            paddingVertical: 13,
            borderRadius: 10,
            // backgroundColor: Colors.PRIMARY,
            backgroundColor: "#e8ebfd",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            width: "50%",
            opacity: createdStas ? 1 : 0.5,
            borderColor: createdStas ? "#f58a6f" : "",
            borderWidth: createdStas ? 1 : 0,
          }}
        >
          <Image
            source={createIcon}
            style={{ width: 30, height: 30, borderRadius: 100 }}
          />

          <Text
            style={{
              color: "#f58a6f",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Created
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRatingStas}
          style={{
            paddingVertical: 13,
            borderRadius: 10,
            backgroundColor: "#e8ebfd",
            width: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            opacity: ratingStas ? 1 : 0.5,
            borderColor: ratingStas ? "#f58a6f" : "",
            borderWidth: ratingStas ? 1 : 0,
          }}
        >
          <FontAwesome name="star" size={24} color="yellow" />
          <Text
            style={{
              color: "#f58a6f",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Rating
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 10 }}>
        {ratingStas && (
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Entypo name="price-tag" size={20} color="black" />
                <Text style={{ fontSize: 13, fontWeight: "600" }}>Tags:</Text>
              </View>
              {ratingStas && (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {activeStars.map((isActive, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleStar(index)}
                        style={[
                          styles.starButton,
                          { backgroundColor: isActive ? "#f58a6f" : "#e8ebfd" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.starText,
                            { color: isActive ? "#fff" : "#3a3a3a" },
                          ]}
                        >
                          {index + 1}
                        </Text>
                        <FontAwesome name="star" size={20} color="yellow" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#f58a6f" />
              ) : error ? (
                <Text
                  style={{
                    color: "#f58a6f",
                    fontSize: 20,
                    fontWeight: "600",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  There are no events available
                </Text>
              ) : !activeIndices ? (
                <ScrollView>
                  {listEventRating?.map((event, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push("event-detail", { event: event })
                      }
                      key={event.id}
                      style={{
                        width: "100%",
                        height: 180,
                        backgroundColor: "#f58a6f",
                        borderRadius: 20,
                        marginTop: 20,
                        paddingLeft: 60,
                        position: "relative",
                        zIndex: 10,
                        // overflow: "visible",
                      }}
                    >
                      <Text
                        style={{
                          position: "absolute",
                          top: 75,
                          left: -20,
                          fontSize: 25,
                          fontWeight: "600",
                          color: "#fff",
                          transform: [{ rotate: "90deg" }],
                        }}
                      >
                        Discover
                      </Text>
                      {/* <TouchableOpacity
                        onPress={() => handleDeleteEvent(event?.id)}
                        style={{
                          position: "absolute",
                          top: -15,
                          right: 0,
                          zIndex: 10,
                        }}
                      >
                        <Image
                          source={backIcon}
                          style={{ width: 30, height: 30 }}
                        />
                      </TouchableOpacity> */}
                      <LinearGradient
                        colors={["#f5bea5", "#f0e5e1"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bgLinear}
                      >
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 20,
                              fontWeight: "600",
                              marginBottom: 10,
                            }}
                          >
                            {event?.title}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{ marginBottom: 10, width: "90%" }}
                          >
                            {event?.description}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                              marginBottom: 15,
                            }}
                          >
                            <EvilIcons
                              name="location"
                              size={30}
                              color="black"
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 14,
                                fontWeight: "400",
                                width: "80%",
                              }}
                            >
                              {event?.place}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                gap: -15,
                                alignItems: "center",
                              }}
                            >
                              {event.participators.map(
                                (participant, i) =>
                                  i < 4 && (
                                    <Image
                                      key={i}
                                      source={{ uri: participant?.avatar }}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 100,
                                      }}
                                    />
                                  )
                              )}
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: "500" }}>
                              {event?.numberOfParticipators} participant
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    marginTop: 20,
                    // flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Animated.View
                    style={{
                      height: 30,
                      // width: 30,
                      transform: [
                        { translateY: Animated.multiply(animatedValue, -1) },
                      ],
                    }}
                  >
                    <Image
                      source={arrowIcon}
                      style={{
                        height: "100%",
                        width: 30,
                        marginLeft: 30,
                        transform: [{ rotate: "180deg" }],
                      }}
                    />
                    <Image
                      source={arrowIcon}
                      style={{
                        height: "100%",
                        width: 30,
                        marginTop: -15,
                        marginLeft: 30,

                        transform: [{ rotate: "180deg" }],
                      }}
                    />

                    <Text
                      style={{
                        width: "100%",
                        color: "#f58a6f",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      Choose star
                    </Text>
                  </Animated.View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
        {createdStas && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="price-tag" size={20} color="black" />
              <Text style={{ fontSize: 13, fontWeight: "600" }}>Tags:</Text>
            </View>
            {createdStas && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dateTypes.map((dateType) => (
                  <TouchableOpacity
                    key={dateType.id}
                    onPress={() => setSelectedDateType(dateType.id)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor:
                        selectedDateType === dateType.id
                          ? "#f58a6f"
                          : "#e8ebfd",
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selectedDateType === dateType.id
                            ? "white"
                            : "#3a3a3a",
                      }}
                    >
                      {dateType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        {createdStas && (
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            style={{
              marginTop: 10,
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#f58a6f" />
            ) : errorCreate ? (
              <Text
                style={{
                  color: "#f58a6f",
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                There are no events available
              </Text>
            ) : (
              listCreateEvent?.map((event, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("event-detail", { event: event })
                  }
                  key={event.id}
                  style={{
                    width: "100%",
                    height: 180,
                    backgroundColor: "#f58a6f",
                    borderRadius: 20,
                    marginTop: 20,
                    paddingLeft: 60,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <Text
                    style={{
                      position: "absolute",
                      top: 75,
                      left: -20,
                      fontSize: 25,
                      fontWeight: "600",
                      color: "#fff",
                      transform: [{ rotate: "90deg" }],
                    }}
                  >
                    Discover
                  </Text>
                  <LinearGradient
                    colors={["#f5bea5", "#f0e5e1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bgLinear}
                  >
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 20,
                          fontWeight: "600",
                          marginBottom: 10,
                        }}
                      >
                        {event?.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ marginBottom: 10, width: "90%" }}
                      >
                        {event?.description}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                          marginBottom: 15,
                        }}
                      >
                        <EvilIcons name="location" size={30} color="black" />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            fontWeight: "400",
                            width: "80%",
                          }}
                        >
                          {event?.place}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: -15,
                            alignItems: "center",
                          }}
                        >
                          {event.participators.map(
                            (participant, i) =>
                              i < 4 && (
                                <Image
                                  key={i}
                                  source={{ uri: participant?.avatar }}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 100,
                                  }}
                                />
                              )
                          )}
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: "500" }}>
                          {event?.numberOfParticipators} participant
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtnContainer: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 20,
  },
  bgLinear: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
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
  ratingButton: {
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#e8ebfd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  ratingText: {
    color: "#f58a6f",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  starButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    // borderWidth: 1,
    borderRadius: 10,
  },
  starText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
