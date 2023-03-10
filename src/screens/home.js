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




  const windowheight = Dimensions.get('window').height;

 var client;
 
const Home = () => {
  
    const[name,setName]= useState('');
    const mqttclient = null;
    const [connected,setconnected] = useState(false);
    const [isFetching, setIsfetching] = useState(true);
    const devicecontxt = useContext(ExpenseContext);
    const [data,setdata] = useState([]);
   
    // const name = firebase.auth().currentUser.displayName
    useEffect(()=>{
      async function getDevicess(){
        setIsfetching(true)
        try{
            // getDocs(collection(db, "users",""))).then((querySnapshot) => {
            //   querySnapshot.forEach((doc) => {
            //       console.log(`${doc.id} => ${doc.data()}`);
            //       setdata(doc.data().device)
            //   });
            //   console.log(data)
            const docRef = doc(db, "users",  getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data().device)
            devicecontxt.setDevices(docSnap.data().device)
          // });
            // devicecontxt.setDevices(data.device)
            // expensecotext.setExpense(expenses)
        }catch(error){
            console.log(error)
            // setError("Could not fetch expenses")
        }
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

        setIsfetching(false)
        
        
    }
    getDevicess()
    if(client){
      
    }
    
    

        // async function fetchToken() {
        //     const storedToken = await AsyncStorage.getItem('name');
        //     setName(storedToken);
        //   }
        //   fetchToken();

          // client.onMessageArrived = function(message) {
          //   console.log('Topic: ' + message.destinationName + ", Message: " + message.payloadString)
          // }
          
          
        //   console.log(firebase.auth().currentUser.uid);
        //   console.log(firebase.auth().currentUser.uid);
        //   console.log(firebase.auth().currentUser.uid);
        // setemail(firebase.auth().currentUser.email)
         setName(getAuth().currentUser.displayName)
    },[])
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
            <DeviceComponent name={itemdata.item.name} url={itemdata.item.topic}  color={itemdata.item.color} mqttfuncon={changeon.bind(this,itemdata.item.topic)} mqttfuncoff={changeoff.bind(this,itemdata.item.topic)} client={client} tankheight={itemdata.item.tankheight}/>
            </View>
        )
    }

  if(isFetching){
        <Background>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {/* <Text style={styles.text}>cdsvdfvdfvdfvdfvdfvdfvdf</Text> */}
        </Background>
  }
  if(connected){
    
  return (
    <SafeAreaView>
    <View>
    <Text style={styles.greet}>Hello {name}!</Text>
    <Text style={styles.homegreet}>Welcome To Your Home</Text>
    </View>
    <View style={styles.screen} >
    <View style={styles.baradd}>
    <Text style={styles.rooms}>Your Devices</Text>
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
      <Text style={styles.nodevices}>No devices Added Yet!</Text>
    }
   

    {/* </ScrollView> */}
</View>
    </View>

    </SafeAreaView>
    
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
    rooms:{
        fontSize:25,
        padding:20,
        paddingBottom:10,
    },
    baradd:{
       
        flexDirection:'row',
        justifyContent:'space-between',
        paddingRight:20,
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
    }
})