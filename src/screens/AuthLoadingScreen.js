import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
// import {firebase} from '../core/config'
import Background from "../components/Background";
import { theme } from "../core/theme";
import { logoutUser } from "../api/auth-api";
import { getAuth } from "firebase/auth";
import { useContext } from "react";
import { ClinetMQTT } from "../../store/mqttClient";

export default function AuthLoadingScreen({ navigation }) {
  // const [user,setuser]= useState();
  // function on

  useEffect(() => {
    try {
      getAuth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user);
          if (!user.emailVerified) {
            Alert.alert("Pleae Verify", "Verfication Email is Sent");

            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          } else {
            console.log(user.email);

            // User is logged in
            navigation.reset({
              index: 0,
              routes: [{ name: "Intro" }],
            });
          }
        } else {
          // User is not logged in
          navigation.reset({
            index: 0,
            routes: [{ name: "StartScreen" }],
          });
        }
      });
    } catch (error) {
      Alert.alert("Error", "Some Error Occured");
    }
  }, []);

  return (
    <Background>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </Background>
  );
}
