import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../core/theme";

import { Ionicons } from "@expo/vector-icons";

export default function PasswordTextInput({
  errorText,
  description,
  ...props
}) {
  const [pvisibility, setvisibility] = useState({
    vstate: false,
    icon: "eye-off",
  });
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        secureTextEntry={!pvisibility.vstate}
        {...props}
      ></Input>

      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      <Ionicons
        name={pvisibility.icon}
        size={24}
        style={styles.icon}
        onPress={() =>
          !pvisibility.vstate
            ? setvisibility({ vstate: true, icon: "eye" })
            : setvisibility({ vstate: false, icon: "eye-off" })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    flexDirection: "row",
  },
  input: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },

  icon: {
    position: "relative",
    zIndex: 1,
    marginLeft: -30,
    marginTop: 15,
    marginRight: 10,

    // backgroundColor: "black",
  },
});
