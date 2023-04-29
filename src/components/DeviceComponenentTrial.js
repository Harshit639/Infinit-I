import { View,Text, Pressable, StyleSheet, Platform,Image, Switch, Dimensions} from "react-native";
import { useEffect, useState, useRef, useLayoutEffect, useContext } from "react";
import { mqttSend } from "../api/auth-api";
import { mqttSendoff } from "../api/auth-api";
import init from 'react_native_mqtt';

import useDidMountEffect from "../helpers/useDidMountEffec";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { ExpenseContext } from '../../store/device-context';
import { Alert } from "react-native";

const screenWidth = Dimensions.get('screen').width;




function DeviceComponentTrial({name,color,onpressed,url,mqttfuncon,mqttfuncoff,client,tankheight}){
    const [isconnected,setisconnected] = useState(false);
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const firstUpdate = useRef(true); 
    const [messager,setmesage] = useState("");
    const [valuesent,setvalue] = useState("");
    const devcontext = useContext(ExpenseContext);
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

     function deletedevice(){
        Alert.alert(
            'Delete Device',
            'Do you want to delete'+name+'?',
            [ 
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => devcontext.deleteDevice(url)
              },
            ],
            {cancelable: false},
          );
     }

    
    return(
        <View style={styles.griditem}>
        <Pressable android_ripple={{color:'#ccc'}}  style={({pressed})=>pressed? [styles.button,styles.pressedbutton]: styles.button}
        onPress={devicepress} onLongPress={deletedevice} >
          
            <View style={isEnabled?[styles.innercontainer,{backgroundColor: 'black',borderWidth:0,shadowColor: 'black',
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.3,
        shadowRadius:8,}]:[styles.innercontainer]}>
            <Image source={isEnabled? require('../assets/wmcw.png'):require('../assets/wmcb.png')} style={styles.image} />
                <Text style={isEnabled?[styles.buttontext,{color:"white"}]:styles.buttontext}>{name}</Text>
                {/* <Text>5 devices</Text> */}
                <View style={styles.toggle}>
                <Switch
                     style={{ transform: [{ scaleX: screenWidth>600?1.6:.8 }, { scaleY: screenWidth>600?1.6:.8 }], marginTop:screenWidth>600?30:5, marginLeft:screenWidth>600?20:0 }}
                    trackColor={{ false: "#767577", true: "white" }}
                    thumbColor={isEnabled ? "#ADE792" : "#f4f3f4"}
                    ios_backgroundColor="#3ebae7"
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
        marginVertical:10,
        // elevation: 14,
        height: screenWidth>600?350:Platform.OS=='android'?Dimensions.get('window').height/5 :Dimensions.get('window').height/5.5 ,
        
        borderRadius:20,
       
        // shadowColor: 'black',
        // shadowOffset:{width:0, height:2},
        // shadowOpacity:0.25,
        // shadowRadius:8,
    //     bordercolor:'#fff',
    //   shadowColor: '#CEEDC7',
    //     shadowOffset:{width:0, height:10},
    //     shadowOpacity:0.25,
    //     shadowRadius:20,
    //     backgroundColor:'white',
    //     overflow: Platform.OS==='android'? 'hidden':'visible',
      backgroundColor:'#fff',
      elevation:30,
      shadowOffset:{width:0, height:2},
      shadowOpacity:0.5,
      shadowRadius:8,
      shadowColor:'#3ebae7',
        
    },

    button:{
        flex:1,
        // shadowColor:'#ff0909',
        // elevation: 14,
    },
    innercontainer:{
        flex:1,
      
        padding:15,
        justifyContent:'center',
        alignContent:'center',
        borderRadius:17,
        borderColor:'#3ebae7',
        // borderWidth:2,
        

    },
    pressedbutton:{
        opacity:0.5
    },
    buttontext:{
        
        fontSize:screenWidth>600?32:16,
        fontWeight:'bold',
        
    },
    image:{
        marginTop:Platform.OS=="android"?15:10,
        height:screenWidth>600?100:55,
        width:screenWidth>600?100:50,
        // backgroundColor:'black'
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

export default DeviceComponentTrial;