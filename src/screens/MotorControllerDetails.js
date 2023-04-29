import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Paho from "paho-mqtt";
import Background from "../components/Background";
import { ActivityIndicator } from "react-native";
import { theme } from "../core/theme";
import { async } from "@firebase/util";
const screenheight = Dimensions.get("screen").height;
const screenwidth = Dimensions.get("screen").width;
const MotorControllerDetails = ({ navigation }) => {
  const route = useRoute();
  const fill = 100;
  const [filled, setfilled] = useState(0);
  const [isFetching, setIsfetching] = useState(true);
  const height = route.params.height;
  console.log(route.params.topic);
  const topic = route.params.topic;

  // console.log()

  // function onMessaage(message){
  //     setfilled(parseInt(message.payloadString))
  // }

  useEffect(() => {
    async function connectsensor() {
      const client = new Paho.Client("reflow.online", Number(9001), "/", "ws");

      await client.connect({
        onSuccess: function () {
          console.log("connectedSENSOR");
          client.subscribe(topic + "/Dist");
          // client.subscribe("test123");
          client.onMessageArrived = function (message) {
            console.log(
              "Topic: " +
                message.destinationName +
                ", Message: " +
                message.payloadString
            );
            setfilled(
              parseInt(
                ((height - parseInt(message.payloadString)) / height) * 100
              )
            );
          };
        },
        userName: "nuclear",
        password: "netquantity",
        useSSL: false,
        onFailure: function () {
          console.log("not connected");
        },
      });
      setIsfetching(false);
    }
    setIsfetching(true);
    setTimeout(() => {
      connectsensor();
    }, 3500);

    return () => {
      // console.log("This will be logged on unmount");
    };
  }, []);

  if (isFetching) {
    return (
      <Background>
        <SafeAreaView style={styles.screen}>
          <View
            style={{
              flexDirection: "row",

              justifyContent: "flex-start",
              zIndex: 1,
              marginLeft: -120,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={35}
              color="black"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: screenheight / 3,
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>

          {/* <Text style={styles.text}>cdsvdfvdfvdfvdfvdfvdfvdf</Text> */}
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView style={styles.screen}>
        <Ionicons
          name="arrow-back"
          size={35}
          color="black"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.text}>
          <Text style={styles.textinner}>Motor Controller</Text>
        </View>

        <View style={styles.progress}>
          <AnimatedCircularProgress
            size={300}
            width={3}
            backgroundWidth={30}
            fill={filled}
            tintColor="#00e0ff"
            backgroundColor="#fff"
            style={styles.progresscontainer}
          >
            {(fill) => (
              <View style={styles.percontainer}>
                <Text style={styles.points}>{filled}%</Text>
                <Text style={styles.filled}>filled</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        <View style={styles.buttoncontainer}>
          <Pressable
            style={({ pressed }) =>
              pressed ? [styles.pressed, styles.button] : [styles.button]
            }
            onPress={() => {
              navigation.navigate("Connect");
            }}
          >
            <Ionicons name="power" size={40} color="#fff" />
            <Text style={styles.power}>Configure Sensor</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default MotorControllerDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 40,
  },
  screen1: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textinner: {
    fontSize: 35,
    fontWeight: "bold",
  },
  progress: {
    marginTop: "20%",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#00e0ff",
    // shadowOffset:{width:0, height:2},
    // shadowOpacity:0.5,
    // shadowRadius:8,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "black",
    borderRadius: 20,
    height: "30%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  buttoncontainer: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  points: {
    fontSize: 50,
    fontWeight: "bold",
    shadowColor: "black",
    color: "#fff",
  },
  progresscontainer: {
    shadowColor: "#00afef",
    backgroundColor: "black",
    borderRadius: 500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  power: {
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: "bold",
    color: "white",
  },
  percontainer: {
    flexDirection: "column",
  },
  filled: {
    fontSize: 25,

    fontWeight: "bold",
    color: "white",
    paddingLeft: 20,
  },
  pressed: {
    opacity: 0.5,
  },
});
