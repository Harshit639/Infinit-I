import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;

const EmptyComponent = () => {
  const navigation = useNavigation();
  function adddevice() {
    navigation.navigate("Settings");
  }
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) =>
        pressed ? [styles.icon, styles.pressed] : styles.icon
      }
      onPress={adddevice}
    >
      <Ionicons name="add-circle-outline" size={60} color="#3ebae7" />
    </Pressable>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  icon: {
    width: "40%",
    // height: Platform.OS=='android'?Dimensions.get('window').height/5.5 :Dimensions.get('window').height/6.5 ,
    height:
      screenWidth > 600
        ? 300
        : Platform.OS == "android"
        ? Dimensions.get("window").height / 5.5
        : Dimensions.get("window").height / 6.5,
    borderColor: "#3ebae7",
    borderWidth: 3,
    alignItems: "center",
    padding: 15,
    justifyContent: "center",
    borderRadius: 20,
    borderStyle: "dashed",
  },
  pressed: {
    opacity: 0.5,
  },
});
