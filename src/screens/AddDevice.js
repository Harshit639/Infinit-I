import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import { logoutUser } from "../api/auth-api";
import { Linking } from "react-native";
import TextInput from "../components/TextInput";
import axios from "axios";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpenseContext } from "../../store/device-context";
import Background from "../components/Background";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { ssidValidator } from "../helpers/ssidValidator";
import { heightValidator } from "../helpers/heightValidator";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-root-toast";

const screenWidth = Dimensions.get("screen").width;

function PressHandlerName() {
  if (Platform.OS == "android") {
    console.log("click");
    Linking.sendIntent("android.settings.WIFI_SETTINGS");
  } else {
    Linking.openURL("App-Prefs:root=WIFI");
  }
}

const RoomsScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [deviceName, setDeviceName] = useState({ value: "", error: "" });
  const [value, setvalue] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(
    "Water Motor Controller"
  );
  const [isLoading, setisLoading] = useState(false);
  const [topic, settopic] = useState();
  const [message, setmessage] = useState("");
  const [tankheight, settankheight] = useState({ value: "", error: "" });
  const [tanktype, settanktype] = useState("500");
  const contextdev = useContext(ExpenseContext);
  const [isonline, setonline] = useState();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setonline(state.isConnected);
    });
  });

  function handler() {
    const emailError = ssidValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const heightError = heightValidator(tankheight.value);
    if (emailError || passwordError || heightError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      settankheight({ ...tankheight, error: heightError });
      return;
    } else {
      storeData(email.value, password.value);
    }
  }

  function handler2() {
    const emailError = ssidValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const heightError = heightValidator(tankheight.value);
    if (emailError || passwordError || heightError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      settankheight({ ...tankheight, error: heightError });
      return;
    } else {
      storedevicedata();
    }
  }

  async function storeData(ssid, passwordx) {
    const emailError = ssidValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const heightError = heightValidator(tankheight.value);
    if (emailError || passwordError || heightError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      settankheight({ ...tankheight, error: heightError });
      return;
    } else {
      console.log(ssid + "####" + passwordx);
      // console.log("vfdvdf");
      // console.log(selectedDevice)
      // contextdev.addDevice("dfvfdvfd","device","#CEEDC7","500")
      // contextdev.addDevice(selectedDevice,topic,"#CEEDC7",tankheight);
      setisLoading(true);

      const response = await axios
        .post(
          "http://192.168.4.1/credentials",
          {
            networkName: ssid,
            password: passwordx,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(function (res) {
          console.log("hellp");
          console.log(res.data);

          setisLoading(false);
          settopic(res.data);
          setmessage("Device Configured,store the device");
        })
        .catch(function (error) {
          console.log(error);
          setisLoading(false);
          Alert.alert("Network Error", "Check Connection to device");
        });
      setvalue(response);
      // console.log(response)
      console.log("fs");
    }
  }

  function storedevicedata() {
    // console.log(value)
    // console.log(selectedDevice);
    // contextdev.addDevice("Water Motor Controller","WB1","#CEEDC7","500");

    if (!isonline) {
      let toast = Toast.show("Please check your Internet connection", {
        duration: Toast.durations.LONG,
      });
      return;
    } else {
      try {
        contextdev.addDevice(
          selectedDevice,
          topic,
          "#CEEDC7",
          tankheight.value
        );
        Alert.alert("Success", "Your device has been stored");
        setEmail({ value: "", error: "" });
        setPassword({ value: "", error: "" });
        settopic("");
        setDeviceName("");
        setmessage("");
        navigation.navigate("Home");
      } catch (err) {
        let toast = Toast.show("Please check your Internet connection", {
          duration: Toast.durations.LONG,
        });
        return;
      }
    }

    // contextdev.addDevice(selectedDevice,topic,"#CEEDC7",tankheight);
    // Alert.alert("Success","Your device has been stored")
    // setEmail({ value: '', error: '' })
    // setPassword({ value: '', error: '' })
    // settopic("")
    // setDeviceName("")
    // navigation.navigate("Home")

    // console.log(isonline);

    //  contextdev.addDevice("Motor Controller","device4","#CEEDC7",100)
  }

  return (
    <ScrollView>
      <Background>
        <SafeAreaView style={styles.screen}>
          <View style={styles.main}>
            <Pressable
              android_ripple={{ color: "#ccc" }}
              style={({ pressed }) =>
                pressed
                  ? [styles.pressed, styles.container]
                  : [styles.container]
              }
              onPress={PressHandlerName}
            >
              <Text style={styles.text}>CONNECT TO THE DEVICE</Text>
              <Image
                source={require("../assets/arrow.png")}
                style={styles.image}
              />
            </Pressable>
            {/* <Button mode="outlined" onPress={PressHandlerName}>Add Device</Button> */}
            <Header style={styles.header}>DEVICE DETAILS</Header>
            <Picker
              // style={styles.twoPickers} itemStyle={styles.twoPickerItems}
              style={
                Platform.OS == "android" ? styles.onePicker : styles.picker
              }
              itemStyle={
                Platform.OS == "android"
                  ? styles.onePickerItem
                  : styles.pickerItem
              }
              selectedValue={selectedDevice}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedDevice(itemValue);
                console.log(itemValue);
              }}
            >
              <Picker.Item
                label="Water Motor Controller"
                value="Water Motor Controller"
              />
              <Picker.Item label="5 channel relay" value="5 channel relay" />
              <Picker.Item label="3 channel relay" value="3 channel relay" />
            </Picker>

            {/* <TextInput
        label="Device Type"
        returnKeyType="next"
        value={deviceName.value}
        onChangeText={(text) => setDeviceName({ value: text, error: '' })}
        // error={!!email.error}
        // errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
      /> */}

            <TextInput
              label="Network SSID"
              returnKeyType="next"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              label=" Network Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
            />
            {selectedDevice == "Water Motor Controller" ? (
              <View style={styles.thirdcomp}>
                <View style={styles.inputds}>
                  <TextInput
                    label="Height of Tank"
                    returnKeyType="next"
                    value={tankheight.value}
                    onChangeText={(text) =>
                      settankheight({ value: text, error: "" })
                    }
                    error={!!tankheight.error}
                    errorText={tankheight.error}
                    autoCapitalize="none"
                    // keyboardType="email-address"
                  />
                </View>

                <Picker
                  // style={styles.twoPickers} itemStyle={styles.twoPickerItems}
                  style={[
                    Platform.OS == "android"
                      ? [styles.onePicker, styles.tanktypeandroid]
                      : [styles.picker, styles.tanktypeios],
                  ]}
                  itemStyle={
                    Platform.OS == "android"
                      ? styles.onePickerItem
                      : styles.pickerItem
                  }
                  selectedValue={tanktype}
                  onValueChange={(itemValue, itemIndex) => {
                    settanktype(itemValue);
                    console.log(itemValue);
                  }}
                >
                  <Picker.Item label="500 L" value="500" />
                  <Picker.Item label="1000 L" value="1000" />
                  <Picker.Item label="1500 L" value="1500" />
                  <Picker.Item label="3000 L" value="3000" />
                  <Picker.Item label="C Tank" value="3" />
                </Picker>
              </View>
            ) : (
              <View></View>
            )}

            {/* <Button mode="outlined" onPress={handler} style={styles.button}>Send</Button> */}
            <Pressable
              android_ripple={{ color: "#ccc" }}
              style={({ pressed }) =>
                pressed
                  ? [styles.pressed, styles.container]
                  : [styles.container]
              }
              onPress={handler}
            >
              <Text style={[styles.text, styles.configure]}>
                CONFIGURE DEVICE
              </Text>
              <ActivityIndicator animating={isLoading} />
            </Pressable>
            <Text>{message}</Text>
            <Text style={styles.warning}>
              *Connect to Internet before storing device
            </Text>
            <Pressable
              android_ripple={{ color: "#ccc" }}
              style={({ pressed }) =>
                pressed
                  ? [styles.pressed, styles.container34]
                  : [styles.container34]
              }
              onPress={handler2}
            >
              <Text style={styles.text}>STORE DEVICE</Text>
            </Pressable>
            {/* <Button mode="outlined" onPress={logoutUser}>Sign Out</Button> */}
          </View>
        </SafeAreaView>
      </Background>
    </ScrollView>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // marginBottom: screenWidth > 400 ? 700 : 5,

    marginTop: screenWidth > 400 ? 100 : 5,
  },
  header: {
    fontSize: screenWidth > 600 ? 30 : 21,
  },
  main: {
    flex: 1,

    alignItems: "center",
    width: screenWidth > 600 ? 600 : screenWidth - 80,
    margin: screenWidth > 600 ? 0 : 30,
    marginTop: 0,
  },
  text: {
    color: "white",

    paddingVertical: 15,
    fontWeight: "bold",
    fontSize: screenWidth > 600 ? 20 : 15,
  },

  configure: {
    paddingLeft: 30,
    paddingRight: 15,
  },
  image: {
    height: 20,
    width: 20,
    marginLeft: 30,
  },

  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    marginTop: 20,
    height: 60,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    marginTop: 50,
    height: 60,
    marginBottom: 50,
  },
  container34: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    marginTop: 20,
    height: 60,
  },
  warning: {
    fontWeight: "bold",
    marginTop: 10,
  },
  picker: {
    width: "100%",
    height: 200,
    marginVertical: -40,
    // backgroundColor: '#FFF0E0',
    // borderColor: 'black',
    // borderWidth: 1,
  },

  pickerItem: {
    color: "black",
  },

  onePicker: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF0E0",
    // borderColor: '#000',
    // borderWidth: 1,
  },
  onePickerItem: {
    height: 44,
    color: "black",
  },

  thirdcomp: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems:'center',
  },

  tanktypeios: {
    width: "45%",
    marginTop: -65,
  },

  tanktypeandroid: {
    width: "50%",
    marginLeft: 5,
    marginTop: 15,
  },

  inputds: {
    width: "50%",
  },
  pressed: {
    opacity: 0.5,
  },
});
