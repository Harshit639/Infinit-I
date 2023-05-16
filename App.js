import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import firebase from 'firebase/app'
// import 'firebase/auth'
import { theme } from "./src/core/theme";

import ConnectSensor from "./src/screens/ConnectSensor";
import {
  AuthLoadingScreen,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
} from "./src/screens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import RoomsEnd from './src/screens/RoomsEnd'
import RoomsScreen from "./src/screens/AddDevice";
import Home from "./src/screens/home";
import { StatusBar } from "expo-status-bar";
import DeviceContextProvider from "./store/device-context";
import ProfileScreen from "./src/screens/ProfileScreen";
// import NewScreen from './src/screens/NewScreen'
// import { FIREBASE_CONFIG } from './src/core/config'
import MotorControllerDetails from "./src/screens/MotorControllerDetails";
import MqttClientProvider from "./store/mqttClient";
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
// if (!firebase.apps.length) {
//   firebase.initializeApp(FIREBASE_CONFIG)
// }

function MyTabs() {
  return (
    <DeviceContextProvider>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={RoomsScreen}
          options={{
            tabBarLabel: "Add Device",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </DeviceContextProvider>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="AuthLoadingScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="AuthLoadingScreen"
              component={AuthLoadingScreen}
            />
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Intro" component={MyTabs}></Stack.Screen>
            <Stack.Screen
              name="Connect"
              component={ConnectSensor}
            ></Stack.Screen>
            <Stack.Screen
              name="MotorControllerDetails"
              component={MotorControllerDetails}
            ></Stack.Screen>
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
