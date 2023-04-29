import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
// import { DEVICES } from '../../data/dummy-data'
import { DEVICES } from '../../store/device-context'
import DeviceComponent from '../components/deviceComponent'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mqttSend } from '../api/auth-api'
import Button from '../components/Button'
import { Platform } from 'react-native'
import {firebase, getAuth} from '../core/config'
import Paho from 'paho-mqtt'
import { ExpenseContext } from '../../store/device-context'
import { useNavigation } from '@react-navigation/native'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import Background from '../components/Background'
import { theme } from '../core/theme'
import { getDocs, collection, getDoc ,doc} from 'firebase/firestore'
import { db } from '../core/config'
import { ActivityIndicator, Alert } from 'react-native'
import { Image } from 'react-native'
import DeviceComponentTrial from '../components/DeviceComponenentTrial'
import axios from 'axios'
import { useLayoutEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import EmptyComponent from '../components/EmptyComponent'



  const windowheight = Dimensions.get('window').height;

 var client;
 
const Home = () => {
  
    const[name,setName]= useState('');
    const mqttclient = null;
    const [connected,setconnected] = useState(false);
    const [isFetching, setIsfetching] = useState(true);
    const devicecontxt = useContext(ExpenseContext);
    const [data,setdata] = useState([]);

    const [againconnect,setagainconnect] = useState();
    const [tempdata,settempdata] = useState({
      temp:32,
      humidity:95,
      carbon:200,
    })

    const focused = useIsFocused();

    useEffect(()=>{
      
      async function getdata(){
        setIsfetching(true)
        const tempdata = await axios.post("https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=5d6b1f234758771642fef1698dfcde50");
        const pollutiondata = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution?lat=13.08&lon=80.27&appid=5d6b1f234758771642fef1698dfcde50")
        console.log(tempdata.data.main.temp);
        // const 
        console.log(pollutiondata.data.list[0].components.co)
        settempdata({
          temp:tempdata.data.main.temp-273,
          humidity:tempdata.data.main.humidity,
          carbon:pollutiondata.data.list[0].components.co,

        })
        // console.log(tempdata.main)
        const docRef = doc(db, "users",  getAuth().currentUser.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().device)
        devicecontxt.setDevices(docSnap.data().device)
        setName(getAuth().currentUser.displayName)
        setIsfetching(false)
      }
      getdata();
      return () => {
        console.log("This will be logged on unmount");
      }
      
     
    },[])
   
    // const name = firebase.auth().currentUser.displayName
    useEffect(()=>{
      async function getDevicess(){
        
        // setconnected(false);
        // setIsfetching(true)
        setagainconnect(false);
        // try{
           
        //     const tempdata = await axios.post("https://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=5d6b1f234758771642fef1698dfcde50");
        //     const pollutiondata = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution?lat=13.08&lon=80.27&appid=5d6b1f234758771642fef1698dfcde50")
        //     console.log(tempdata.data.main.temp);
        //     console.log(pollutiondata.data.list[0].components.co)
        //     settempdata({
        //       temp:tempdata.data.main.temp,
        //       humidity:tempdata.data.main.humidity,
        //       carbon:pollutiondata.data.list[0].components.co,

        //     })
        //     const docRef = doc(db, "users",  getAuth().currentUser.uid);
        //     const docSnap = await getDoc(docRef);
        //     console.log(docSnap.data().device)
        //     devicecontxt.setDevices(docSnap.data().device)
     
        // }catch(error){
        //     console.log(error)
        // }
         client = new Paho.Client(
          'reflow.online',
          Number(9001),
          '/',
          'ws'
        );
        await client.connect({
          onSuccess: function() {
            console.log('connected');
            client.subscribe('led');
            setconnected(true);
            setagainconnect(true);
        //     let message = new Paho.Message("Hello World!");
        // message.destinationName = "my/topic";
        // client.send(message);
          },
          userName: 'nuclear',
          password: 'netquantity',
          useSSL: false,
          onFailure: function(){
            console.log('not connected');
          }
        });

      
        // setIsfetching(false)
        
        
    }
    getDevicess()
    return () => {
      console.log("This will be logged on unmount");
    }
   
        
    },[focused])
    function changeon(topic){

        let message = new Paho.Message("ON");
        message.destinationName = topic;
        client.send(message);
        console.log("senton")
      }
      function changeoff(topic){

        let message = new Paho.Message("OFF");
        message.destinationName = topic;
        client.send(message);
        console.log("sentoff")
      }
   

    const navigation = useNavigation();
    function renderfunction(itemdata){
      
    

        function onpressedhandler(){
            mqttSend(itemdata.item.url)
        }
        return (
            <View style={styles.tile}>
            <DeviceComponentTrial name={itemdata.item.name} url={itemdata.item.topic}  color={itemdata.item.color} mqttfuncon={changeon.bind(this,itemdata.item.topic)} mqttfuncoff={changeoff.bind(this,itemdata.item.topic)} client={client} tankheight={itemdata.item.tankheight}/>
            </View>
        )
    }


  if(isFetching){
    return(
      <Background>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {/* <Text style={styles.text}>cdsvdfvdfvdfvdfvdfvdfvdf</Text> */}
      </Background>
    )
       
  }
  if(connected){
    
  return (
    <Background>
    <SafeAreaView style={styles.top}>
    <View style={styles.headercomp}>
    {/* <Text style={styles.greet}>Hello {name}!</Text> */}
    {/* <Text style={styles.homegreet}>Welcome To Your Home</Text> */}
    <View>
    <Text style={styles.head1}>Welcome Home,</Text>
    <Text style={styles.head2}>{name}</Text>
    </View>
    <View>
      <Image style={styles.profileimg} source={require('../assets/profilehome.png')}   />
    </View>
    </View>
    <View style={styles.tempcomponent}>
      <View style={styles.indiviualcomp}>
        <Image style={styles.tempcompimg} source={require('../assets/temperature.png')} />
        <Text style={styles.temptext}>{parseInt(tempdata.temp)}°C</Text>
      </View>
      <View style={styles.indiviualcomp}>
        <Image style={styles.tempcompimg} source={require('../assets/humidity.png')} />
        <Text style={styles.temptext}>{tempdata.humidity}%</Text>
      </View>
      <View style={styles.indiviualcomp}>
        <Image style={styles.tempcompimg} source={require('../assets/co2.png')} />
        <Text style={styles.temptext}>200p</Text>
      </View>
    </View>
    <View style={styles.screen} >
    <View style={styles.baradd}>
    <Text style={styles.rooms}>Your Devices</Text>
    {againconnect? <Text style={[styles.connectingtext,{color:'green'}]}>connected</Text> :<Text style={[styles.connectingtext,{color:'red'}]}>connecting</Text>}
    {/* <Button mode={'contained'} style={styles.button} >+ ADD DEVICE</Button> */}
    </View>
   <View style={styles.list}>
    {/* <ScrollView> */}
    {
      devicecontxt.devices?
      <FlatList 
    // data={DEVICES.concat(devicecontxt.devices)  }
    data={devicecontxt.devices }
    keyExtractor={(item) => (item.name)}
    renderItem={renderfunction}
    contentContainerStyle={{
      flexGrow: 1,
      paddingBottom:500,
      }}
    numColumns={2}/>
      :
      <View style={styles.emptybutton}>
      <EmptyComponent/>
      </View>
     
     
     
    }
   

    {/* </ScrollView> */}
</View>
    </View>

    </SafeAreaView>
    </Background>
    
    
  )
  }else{

    return(
    
    <Background>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {/* <Text style={styles.text}>cdsvdfvdfvdfvdfvdfvdfvdf</Text> */}
    </Background>
    
    // <SafeAreaView>
    // <View>
    // <Text style={styles.greet}>Hello {name}!</Text>
    // </View>

    // </SafeAreaView>
    )
  }
}

export default Home

const styles = StyleSheet.create({
    tile:{
        width:'50%',
    },
    screen:{
        marginTop:10,
    },
    greet:{
        fontSize:30,
        padding:20,
        paddingBottom:10,
        fontWeight:'bold',
    },
    homegreet:{
        fontSize:25,
        padding:20,
        paddingTop:0,
    },

    headercomp:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      marginTop:5,
      marginLeft:20,
      marginRight:20,
      backgroundColor:'#c5eefd',
      borderRadius:15,
      paddingLeft:5,
      
    },

    profileimg:{
      marginRight:10,
      height:50,
      width:50,
      
    },

    head1:{
      padding:20,
      color:'#3ebae7',
      fontSize:20,
      paddingBottom:5,
      fontWeight:'bold',
      paddingLeft:5,
    },
    head2:{
      padding:20,
      paddingLeft:5,
      paddingTop:0,
      fontSize:23,
      fontWeight:'bold',

    },
    rooms:{
        fontSize:20,
        padding:20,
        paddingBottom:10,
        color:'#3ebae7',
        fontWeight:'bold',
        
    },
    baradd:{
       
        flexDirection:'row',
        justifyContent:'space-between',
        paddingRight:20,
        alignItems:'center',
    },
    button:{
        width: Platform.OS=='android'?'50%':'100%'
    },
    list:{
      height:'100%',
        // paddingBottom: Dimensions.get(),
    
    },
    text:{
        fontSize:24,
    },
    nodevices:{
      fontSize:30,
        padding:20,
        paddingBottom:10,
        fontWeight:'light',
    },

    tempcomponent:{
      flexDirection:'row',
      // border: 2,
      // borderWidth:2,
      // borderColor:'#e4d9d9',
      // borderColor:'#3ebae7',
      // borderRadius: '10%',
      // margin:15,
      marginHorizontal:5,
      padding:20,
      justifyContent:'space-between',
      paddingLeft:15,
      paddingRight:15,
    },
    tempcompimg:{
      height:40,
      width:40,
      
      marginBottom:5,
    },
    indiviualcomp:{
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#ffffff',
      padding:20,
      paddingHorizontal:25,
      borderRadius:20,
      bordercolor:'#fff',
      backgroundColor:'white',
      shadowColor: '#3ebae7',
      elevation:4,
      shadowOffset:{width:0, height:2},
      shadowOpacity:0.5,
      shadowRadius:8,
      width:'30%',
      shadowColor:'#3ebae7',

    },
    temptext:{
      fontSize:13,
      fontWeight:'bold'
    },
    top:{
      backgroundColor:"#fff",
      
    },
    connectingtext:{
      marginRight:2,
      marginTop:5,
      fontWeight:'bold',
    },
    emptybutton:{
      paddingLeft:20,
      paddingTop:20,
    }

})