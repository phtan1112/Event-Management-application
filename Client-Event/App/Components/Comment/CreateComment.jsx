import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserLogin } from "../../Context/context";
import StarRating from "./StarRating";
import Colors from "../../Utils/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import rateImg from "../../../assets/images/rate.png";
import { PORT_API } from "../../Utils/Config";
import { useEventContext } from "../../Context/SaveContext";

export default function CreateComment({ eventId }) {
  console.log(eventId);
  const { userData } = useUserLogin();

  const { updateListEvent, commentEventUpdate, updateCommentEvent } =
    useEventContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateCommentModal, setUpdateCommentModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [editRating, setEditRating] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [editCommentText, setEditCommentText] = useState("");
  const [idComment, setIdComment] = useState();
  const [loading, setLoading] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [hasCommented, setHasCommented] = useState(false);
  const [error, setError] = useState(false);

  const totalStars = 5;
  const handleInputChange = (inputText) => {
    setCommentText(inputText);
  };
  console.log("hasCommented", hasCommented);
  const handleStarPress = (star) => {
    setRating(star);
  };
  const handleEditStarPress = (star) => {
    setEditRating(star);
  };
  const handleComment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PORT_API}/api/v1/comment/new-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          content: commentText,
          star: rating,
          event_id: eventId,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Comment submitted successfully");
        setIsModalVisible(false);
        setHasCommented(true);
        handleFetchComment();
      } else {
        Alert.alert("Error", "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };
  const handleFetchComment = async () => {
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/event/all-events-of-all-users`
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        const commentsForEvent = data?.filter((event) => event.id === eventId);

        const userHasCommented = commentsForEvent[0]?.comments?.some(
          (comment) => comment?.user?.email === userData?.email
        );
        console.log("hasCommented", hasCommented);

        if (userHasCommented) {
          setHasCommented(true);
        }

        setListComment(commentsForEvent[0]?.comments);
      } else if (response.status === 400) {
        setError(true);
      } else {
        // Handle other error statuses
        console.error("Failed to fetch comments. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  const deleteComment = async (id) => {
    try {
      const response = await fetch(
        `${PORT_API}/api/v1/comment/remove-comment/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      if (response.ok) {
        console.log(true);
        setHasCommented(false);
        handleFetchComment();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  const closeUpdateCommentModal = () => {
    setUpdateCommentModal(false);
  };
  const editComment = async (commentID, currentComment) => {
    setUpdateCommentModal(true);
    setEditCommentText(currentComment);
    setEditCommentText(currentComment);
    setIdComment(commentID);
  };
  const handleSubmitEditComment = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${PORT_API}/api/v1/comment/edit-comment/${idComment}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
          body: JSON.stringify({
            content: editCommentText,
            star: editRating ? editRating : rating,
          }),
        }
      );
      if (response.ok) {
        console.log("Success edit comment");
        handleFetchComment();
        setUpdateCommentModal(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchComment();
  }, []);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontFamily: "appFont-semi" }}>
          Comments
        </Text>
        {!hasCommented ? (
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={{
              fontSize: 15,
              fontFamily: "appFont-semi",

              paddingHorizontal: 8,
              paddingVertical: 1,
              borderRadius: 100,
              backgroundColor: Colors.PRIMARY,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>+</Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>
      {listComment?.map((comment, index) => (
        <View key={index} style={{ padding: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image
              source={{ uri: comment?.user?.avatar }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 100,
                alignSelf: "flex-start",
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  {comment?.user?.fullName}
                </Text>
                <StarRating rating={comment?.star} />
              </View>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  width: "100%",
                  marginTop: 5,
                }}
              >
                {comment?.content}
              </Text>
            </View>
          </View>
          {userData?.email === comment?.user?.email && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => editComment(comment?.id, comment?.content)}
                style={{ marginTop: 5 }}
              >
                <FontAwesome name="edit" size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteComment(comment?.id)}>
                <MaterialIcons
                  name="delete-outline"
                  size={26}
                  color={Colors.PRIMARY}
                />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              height: 1,
              width: "100%",
              borderWidth: 0.2,
              borderColor: Colors.GRAY,
              marginTop: 14,
            }}
          ></View>
        </View>
      ))}

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#fff",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ flex: 1 }}></Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 100,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>X</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={rateImg}
              style={{ width: 300, height: 300, marginTop: -30 }}
            />
            <Text style={{ fontSize: 25, fontWeight: "700" }}>
              Please Rate The Events!
            </Text>
            <View style={{ flexDirection: "row" }}>
              {[...Array(totalStars).keys()].map((index) => {
                const star = index + 1;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleStarPress(star)}
                    style={styles.star}
                  >
                    <Text
                      style={
                        rating >= star ? styles.filledStar : styles.emptyStar
                      }
                    >
                      &#9733;
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#3a3a3a" }}>
              Your Comments and Suggestions help us
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#3a3a3a" }}>
              Improve the service quality better
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={handleInputChange}
              value={commentText}
              placeholder="Enter your comment"
              textAlignVertical="top"
              multiline={true} // Enable multiline input
              numberOfLines={3}
            />
            <TouchableOpacity
              onPress={handleComment}
              style={{
                backgroundColor: Colors.PRIMARY,
                paddingVertical: 15,
                borderRadius: 100,
                width: "100%",
                marginTop: 20,
                pointerEvents: loading ? "none" : "",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#00ff00" />
                ) : (
                  "Submit"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={updateCommentModal}
        onRequestClose={() => setUpdateCommentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setUpdateCommentModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    paddingVertical: 20,
                    textTransform: "uppercase",
                  }}
                >
                  Update Comment
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {[...Array(totalStars).keys()].map((index) => {
                    const star = index + 1;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleEditStarPress(star)}
                        style={styles.star}
                      >
                        <Text
                          style={
                            editRating >= star
                              ? styles.filledStar
                              : styles.emptyStar
                          }
                        >
                          &#9733;
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View
                  style={{
                    width: "100%",
                    marginTop: 20,
                    paddingVertical: 15,
                    paddingHorizontal: 8,
                    shadowColor: "#52006A",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 5,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    placeholder="Edit your comment"
                    value={editCommentText}
                    onChangeText={(text) => setEditCommentText(text)}
                    style={{ fontSize: 15, fontWeight: "500" }}
                    textAlignVertical="top"
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 5,
                    marginTop: 25,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleSubmitEditComment()}
                    style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: Colors.PRIMARY,
                      width: "50%",
                      pointerEvents: loading ? "none" : "",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#00ff00" />
                      ) : (
                        "Ok"
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setUpdateCommentModal(false)}
                    style={{
                      borderRadius: 50,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: "#fff",
                      shadowColor: "#52006A",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 5,
                      width: "50%",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.PRIMARY,
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "500",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  star: {
    margin: 5,
  },
  filledStar: {
    fontSize: 40,
    color: "gold",
  },
  emptyStar: {
    fontSize: 40,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
    height: 100,
    marginTop: 20,
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
