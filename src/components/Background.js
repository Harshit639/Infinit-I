import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { theme } from "../core/theme";

export default function Background({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.top}>
        <ImageBackground
          source={require("../assets/background_dot.png")}
          resizeMode="repeat"
          style={styles.background}
        >
          <KeyboardAvoidingView style={styles.container} behavior="height">
            {children}
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: 2000,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    flex: 1,
  },
});
