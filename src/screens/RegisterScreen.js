import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { signUpUser } from "../api/auth-api";
import { phoneNoValidator } from "../helpers/phoneNoValidator";
import Checkbox from "expo-checkbox";
// import Toast from "react-native-root-toast";
import Toast from "../components/Toast";
import { Linking } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [phoneNo, setPhoneNo] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [isChecked, setChecked] = useState(false);

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const phoneNoError = phoneNoValidator(phoneNo.value);

    if (emailError || passwordError || nameError || phoneNoError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setPhoneNo({ ...phoneNo, error: phoneNoError });
      return;
    }

    if (!isChecked) {
      Alert.alert("Alert", "Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    const response = await signUpUser({
      name: name.value,
      email: email.value,
      password: password.value,
      phoneNo: phoneNo.value,
    });
    if (response.error) {
      setError(response.error);
    }
    setLoading(false);
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="PhoneNo"
        returnKeyType="next"
        value={phoneNo.value}
        onChangeText={(text) => setPhoneNo({ value: text, error: "" })}
        error={!!phoneNo.error}
        errorText={phoneNo.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.termscontainer}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#4630EB" : undefined}
        />
        <Text>
          I agree to the{" "}
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://reflowtech.in/terms.html")}
          >
            terms and conditions and the privacy policy
          </Text>
        </Text>
      </View>

      <Button
        loading={loading}
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toast}>
        <Toast message={error} onDismiss={() => setError("")} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  toast: {
    zIndex: 1,
    marginTop: -90,
    justifyContent: "center",
    alignItems: "center",
  },

  termscontainer: {
    flexDirection: "row",
    marginLeft: 5,
    marginTop: 10,
    marginRight: 10,
  },

  checkbox: {
    marginRight: 10,
  },
});
