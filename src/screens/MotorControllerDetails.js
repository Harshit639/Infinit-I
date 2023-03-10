import { StyleSheet, Text, View, SafeAreaView, Pressable, } from 'react-native'
import { useRoute } from '@react-navigation/native';
import React, { useEffect,useState } from 'react'
import {Ionicons} from '@expo/vector-icons'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Paho from 'paho-mqtt'




const MotorControllerDetails = ({navigation}) => {
    const route = useRoute();
    const fill= 100;
    const [filled,setfilled]  = useState(0);
    const height = route.params.height;
    console.log(route.params.topic)
    const topic= route.params.topic
    // console.log()

    // function onMessaage(message){
    //     setfilled(parseInt(message.payloadString))
    // }

    useEffect(()=>{
        const  client = new Paho.Client(
            'reflow.online',
            Number(9001),
            '/',
            'ws'
          );
        client.connect({
            onSuccess: function() {
              console.log('connected');
              client.subscribe(topic+'/tank');
              client.onMessageArrived = function(message) {
                setfilled(((height - parseInt(message.payloadString))/height)*100);
                console.log('Topic: ' + message.destinationName + ", Message: " + message.payloadString)
              }
            },
            userName: 'nuclear',
            password: 'netquantity',
            useSSL: false,
            onFailure: function(){
              console.log('not connected');
            }
          });

    },[])
         
              
    
  return (
    <SafeAreaView style={styles.screen}>
    <Ionicons name='arrow-back' size={35} color="black" onPress={()=>{
        navigation.goBack()
    }}/>
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
          {fill => 
          <View style={styles.percontainer}>
            <Text style={styles.points}>{filled}%</Text>
            <Text style={styles.filled}>filled</Text>
          </View>
          }
        </AnimatedCircularProgress>

    </View>
    <View style={styles.buttoncontainer}>
        <Pressable style={styles.button}>
          <Ionicons name='power' size={40} color='#fff'/>
          <Text style={styles.power} onPress={()=>{
            navigation.navigate("Connect");
          }}>Configure Sensor</Text>
        </Pressable>
    </View>
    </SafeAreaView>
  )
}

export default MotorControllerDetails

const styles = StyleSheet.create({
    screen:{
        flex:1,
        margin:40,
    },
    text:{
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
    },
    textinner:{
        fontSize:35,
        fontWeight:'bold',
    },
    progress:{
        marginTop:'20%',
        alignItems:'center',
        justifyContent:'center',
        // shadowColor: "#00e0ff",
        // shadowOffset:{width:0, height:2},
        // shadowOpacity:0.5,
        // shadowRadius:8,
    },
    button:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'90%',
        backgroundColor:'black',
        borderRadius:20,
        height:'30%',
        shadowColor: 'black',
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:8,
    
        overflow: Platform.OS==='android'? 'hidden':'visible',

    },
    buttoncontainer:{
        marginTop:'10%',
        justifyContent:'center',
        alignItems:'center',
        
    },
    points:{
        fontSize:50,
        fontWeight:'bold',
        shadowColor: 'black',
        color:"#fff",
    },
    progresscontainer:{
        shadowColor: '#00afef',
        backgroundColor:'black',
        borderRadius:500,
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:8,
    },
    power:{
        fontSize:20,
        paddingLeft:10,
        fontWeight:'bold',
        color:'white',
    },
    percontainer:{
        flexDirection:'column'
    },
    filled:{
        fontSize:25,
        
        fontWeight:'bold',
        color:'white',
        paddingLeft:20
    }
})