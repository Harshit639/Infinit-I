import { View,Text, Pressable, StyleSheet, Platform,Image, Switch, Dimensions} from "react-native";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { mqttSend } from "../api/auth-api";
import { mqttSendoff } from "../api/auth-api";
import init from 'react_native_mqtt';

import useDidMountEffect from "../helpers/useDidMountEffec";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";






function DeviceComponent({name,color,onpressed,url,mqttfuncon,mqttfuncoff,client,tankheight}){
    const [isconnected,setisconnected] = useState(false);
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const firstUpdate = useRef(true); 
    const [messager,setmesage] = useState("");
    const [valuesent,setvalue] = useState("");
    // console.log(url);
    // client.subscribe(url);
    // client.onMessageArrived = function(message) {
    //     console.log( message.payloadString+"fuckoff")
    //     setmesage(message.payloadString)
    //     // if(isEnabled==true){
    //     //     isEnabled= false
    //     // }
    //   }

    useEffect(() => {
        if (firstUpdate.current) {
          firstUpdate.current = false;
        //  client.subscribe('led', {qos:1, retain:true});
        //   client.onMessageArrived = function(message) {
        //     console.log('Lauda: ' + message.destinationName + ", Message: " + message.payloadString)
            
        //     if(message.payloadString=="OFF"){
        //                 isEnabled= false
        //             }else{
        //                 isEnabled=true;
        //             }
        //     }
        } else {
         // do things after first render
         if(!isEnabled){
            // mqttSendoff(url)
            mqttfuncoff()
            

            
            }else{
                mqttfuncon()
            }
        }
      },[isEnabled]);


      useEffect(()=>{
        if(messager=="OFF"){
            setIsEnabled(false)
            console.log("I fucked you")
        }else if(messager=="ON"){
            setIsEnabled(true);
        }

      },[messager]);
    // client.onMessageArrived = function(message) {
    //     console.log('Lauda: ' + message.destinationName + ", Message: " + message.payloadString)
        
    //     if(message.payloadString=="OFF"){
    //                 isEnabled= false
    //             }else{
    //                 isEnabled=true;
    //             }
    //     }
      

    // if(isEnabled){
        //  mqttSend(url)
        // mqttfuncon("ON")
        // client.onMessageArrived = function(message) {
        //     console.log('Lauda: ' + message.destinationName + ", Message: " + message.payloadString)
            
        //   }
        
        
    // }
    // if(!isEnabled){
        // mqttSendoff(url)
        //  mqttfuncoff("OFF")
   
//  }
//     useEffect(()=>{
        
//         if(!isEnabled){
//             // mqttSendoff(url)
//             mqttfuncoff("OFF")
       
//     }else{
//         mqttfuncon("ON")
//     }
// },[isEnabled])
     function devicepress(){
        navigation.navigate("MotorControllerDetails",{
            topic: url,
            height: tankheight,
        })
     }

    
    return(
        <View style={styles.griditem}>
        <Pressable android_ripple={{color:'#ccc'}}  style={({pressed})=>pressed? [styles.button,styles.pressedbutton]: styles.button}
        onPress={devicepress}>
          
            <View style={isEnabled?[styles.innercontainer,{backgroundColor: 'black'}]:[styles.innercontainer,{backgroundColor: color}]}>
            <Image source={isEnabled? require('../assets/acwhite.png'):require('../assets/ac.png')} style={styles.image} />
                <Text style={isEnabled?[styles.buttontext,{color:"white"}]:styles.buttontext}>{name}</Text>
                {/* <Text>5 devices</Text> */}
                <View style={styles.toggle}>
                <Switch
                     style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginTop:5 }}
                    trackColor={{ false: "#767577", true: "white" }}
                    thumbColor={isEnabled ? "#ADE792" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
{/*                 
                {isconnected?<View style={styles.circle}/>
                :<Pressable onPress={()=>navigation.navigate("Connect",{
                    isconnected: setisconnected,
                })}>
                    <Text style={styles.connect}>Connect</Text>
                </Pressable> 
                } */}
                {/* <Pressable onPress={()=>navigation.navigate("Connect",{
                    isconnected: setisconnected,
                })}>
                    <Text style={styles.connect}>Connect</Text>
                </Pressable> */}
                </View>
                {/* <Text style={styles.buttontext}>{name}</Text> */}
            </View>
        </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    griditem:{
        flex:1,
        margin:16,
        elevation: 4,
        height: Platform.OS=='android'?Dimensions.get('window').height/5 :Dimensions.get('window').height/6 ,
        borderRadius:36,
        shadowColor: 'black',
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:8,
        backgroundColor:'white',
        overflow: Platform.OS==='android'? 'hidden':'visible',
        
    },

    button:{
        flex:1,
    },
    innercontainer:{
        flex:1,
      
        padding:15,
        justifyContent:'center',
        alignContent:'center',
        borderRadius:36,
    },
    pressedbutton:{
        opacity:0.5
    },
    buttontext:{
        fontSize:16,
        fontWeight:'bold'
    },
    image:{
        height:50,
        width:50
    },
    // toggle:{
    //     marginLeft:-10,
    //     flexDirection:'row',
    //     justifyContent:'space-around',
    //     alignItems:'center',
    // },
    connect:{
        color:'red',
        fontSize:17,
        textDecorationLine:'underline'
    },
    circle:{
        height:17,
        width:17,
        borderRadius:'50%',
        backgroundColor:'green',
        marginLeft:10,
        marginTop:5,
    }

    //pressed styles


})

export default DeviceComponent;