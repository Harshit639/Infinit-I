import React, { useState } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import Toast from "../components/Toast";
import { StyleSheet, View } from "react-native";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ value: "", type: "" });

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    setLoading(true);
    await sendPasswordResetEmail(getAuth(), email.value)
      .then(() => {
        // Password reset email sent!
        setToast({
          type: "success",
          message: "Email with password has been sent.",
        });
      })
      .catch((error) => {
        setToast({ type: "error", message: error.message });
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    // const response = await sendPasswordResetEmail(getAuth(),email.value)
    // if (response.error) {
    //   setToast({ type: 'error', message: response.error })
    // } else {
    //   setToast({
    //     type: 'success',
    //     message: 'Email with password has been sent.',
    //   })
    // }
    setLoading(false);
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
      />
      <Button
        loading={loading}
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
      <View style={styles.toast}>
        <Toast {...toast} onDismiss={() => setToast({ value: "", type: "" })} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  toast: {
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
