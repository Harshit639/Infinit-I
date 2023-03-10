import { Alert, Pressable, StyleSheet, Text, View,Image } from 'react-native'
import React,{useContext, useState} from 'react'
import Button from '../components/Button'
import { logoutUser } from '../api/auth-api'
import { Linking } from 'react-native';
import TextInput from '../components/TextInput';
import axios from 'axios';
import Header from '../components/Header';
import {Ionicons} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpenseContext } from '../../store/device-context';
import Background from '../components/Background';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
function PressHandlerName(){
  Linking.openURL("App-Prefs:root=WIFI");
}


const ConnectSensor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  // const [deviceName, setDeviceName]= useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState(false)
  const [message,setmessage] = useState("");
  // const { isconnected } = route.params;
  const contextdev = useContext(ExpenseContext);
  function handler(){
    storeData(email.value,password.value)
  }
  async function storeData(ssid,password){
    console.log(ssid+"####"+password)
     setisLoading(true); 
     const response= await axios.post(
        'http://192.168.4.1/credentials', 
        {
          "networkName": ssid,
          "password":password,
        },{
          timeout: 8000,
        },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }}
    ).then(function (res) {
      console.log("hellp");
      // console.log(res.data)
      setisLoading(false);
      // settopic(res.data)
      setmessage("Device Configured");
  })
  .catch(function (error) {
      console.log(error);
      Alert.alert("Network Error","Check Connection to device")
      setisLoading(false);
  });
  // setvalue(response)
  // console.log(response)
  console.log("fs")
    }

    

  return (
    <Background>
    <SafeAreaView style={styles.screen}>
    <View style={styles.main}>
      
      <Pressable style={styles.container}>
        <Text style={styles.text}>CONNECT TO THE DEVICE</Text>
        <Image source={require('../assets/arrow.png')} style={styles.image} />
      </Pressable>
      {/* <Button mode="outlined" onPress={PressHandlerName}>Add Device</Button> */}
      <Header>DEVICE DETAILS</Header>
      <TextInput
        label="Network SSID"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label=" Network Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
       {/* <Button mode="outlined" onPress={handler} style={styles.button}>Send</Button> */}
       <Pressable style={styles.container} onPress={handler} >
        <Text style={styles.text}>CONNECT</Text>
        <ActivityIndicator animating={isLoading}/>

      </Pressable>
      <Text>{message}</Text>
      {/* <Button mode="outlined" onPress={logoutUser}>Sign Out</Button> */}
    </View>
    </SafeAreaView>
    </Background>
  )
}

export default ConnectSensor

const styles = StyleSheet.create({
  screen:{
    flex:1,
    marginTop:20,
  },
    main:{
        flex:1,
        
        alignItems:'center',
        margin:30,
    },
    text:{
      color:'white',
      
      paddingVertical:15,
      fontWeight:'bold',
      fontSize:15,

    

    },
    image:{
      height:20,
      width:20,
    },
  
    container:{
      flexDirection:'row',  
      justifyContent:'space-around',
      alignItems:'center',
      backgroundColor:'black',
      width:'100%',
      marginTop:50,
      height:60,
      marginBottom:50,

    },
    


})