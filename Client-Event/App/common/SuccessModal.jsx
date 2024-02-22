import React from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import successIcon from "../../assets/images/success-green.png";

const SuccessModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={successIcon} style={styles.icon} />
            <Text style={styles.modalText}>
              Your Event has been{"\n"}successfully published
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <Text style={styles.okButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black color
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  okButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 100,
    backgroundColor: "#3bb54a",
  },
  okButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
  },
});

export default SuccessModal;
