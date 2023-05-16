import { Alert, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { ssidValidator } from "../helpers/ssidValidator";

function PressHandlerName() {
  if (Platform.OS == "android") {
    console.log("click");
    Linking.sendIntent("android.settings.WIFI_SETTINGS");
  } else {
    Linking.openURL("App-Prefs:root=WIFI");
  }
}

const ConnectSensor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  // const [deviceName, setDeviceName]= useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState(false);
  const [message, setmessage] = useState("");
  const [tanktype, settanktype] = useState("500");
  // const { isconnected } = route.params;
  const contextdev = useContext(ExpenseContext);
  function handler() {
    storeData(email.value, password.value, tanktype);
  }
  async function storeData(ssid, passwordx, volume) {
    const emailError = ssidValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      console.log(ssid + "####" + password);

      setisLoading(true);
      const response = await axios
        .post(
          "http://192.168.4.1/credentials",
          {
            networkName: ssid,
            password: passwordx,
            volume: volume,
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
          // console.log(res.data)
          setisLoading(false);
          // settopic(res.data)
          setmessage("Device Configured");
          Alert.alert("Success", "Device Configured");
          navigation.goBack();
        })
        .catch(function (error) {
          console.log(error);
          Alert.alert("Network Error", "Check Connection to device");
          setisLoading(false);
        });
      // setvalue(response)
      // console.log(response)
      console.log("fs");
    }
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
        <View style={styles.main}>
          <Pressable
            style={({ pressed }) =>
              pressed ? [styles.pressed, styles.container] : [styles.container]
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
          <Header>SENSOR DETAILS</Header>
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
            <Picker.Item label="2000 L" value="2000" />
            <Picker.Item label="3000 L" value="3000" />
            <Picker.Item label="C Tank" value="3" />
          </Picker>
          {/* <Button mode="outlined" onPress={handler} style={styles.button}>Send</Button> */}
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.container1, styles.pressed]
                : [styles.container1]
            }
            onPress={handler}
          >
            <Text style={styles.text}>CONNECT</Text>
            <ActivityIndicator animating={isLoading} />
          </Pressable>
          <Text>{message}</Text>
          {/* <Button mode="outlined" onPress={logoutUser}>Sign Out</Button> */}
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default ConnectSensor;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  main: {
    flex: 1,

    alignItems: "center",
    margin: 30,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
  },
  text: {
    color: "white",
    paddingVertical: 15,
    fontWeight: "bold",
    fontSize: 15,
    paddingRight: 10,
  },
  image: {
    height: 20,
    width: 20,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    marginTop: 50,
    height: 60,
    marginBottom: 50,
  },

  container1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    marginTop: 50,
    height: 60,
    marginBottom: 50,
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

  pressed: {
    opacity: 0.5,
  },
});
