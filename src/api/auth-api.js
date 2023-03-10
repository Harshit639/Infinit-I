// import {firebase} from '../core/config'
import { signInWithEmailAndPassword,createUserWithEmailAndPassword, getAuth, updateProfile,sendEmailVerification, onAuthStateChanged } from 'firebase/auth'
// import 'firebase/auth'
import { Alert } from 'react-native'

// import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../core/config';

export const logoutUser = () => {
  getAuth().signOut()
  // AsyncStorage.removeItem('token');
}

export const signUpUser = async ({ name, email, password, phoneNo }) => {
  console.log("clicked")
  try {
    const  user = await createUserWithEmailAndPassword(getAuth(),email,password)
      .then(async ()=>{
        await sendEmailVerification(getAuth().currentUser,{
            handleCodeInApp:true,
            url:'https://reflow-react-authentication.firebaseapp.com'
        })
        .then(async () => {
          console.log(getAuth().currentUser.uid)
           await setDoc(doc(db,"users",getAuth().currentUser.uid),{
            email: email,
            phoneNo: phoneNo,
            name: name,
          })
            // firebase.firestore().collection('users')
            // .doc(firebase.auth().currentUser.uid)
            // .set({
            //     name,
            //     email,
            //     phoneNo,
            // })
        })
    })
    // getAuth().currentUser.updateProfile({
    //   displayName: name,
    // })
    updateProfile(getAuth().currentUser,{
      displayName: name,
    })
    .then(()=>{
      // firebase.auth().signOut()
      
      getAuth().signOut()
      // AsyncStorage.removeItem('token');
    })
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const user = await signInWithEmailAndPassword(getAuth(),email,password)
      try{
      getAuth().onAuthStateChanged((user) => {
        if (user) {
          if(user.emailVerified){
            return ;
          }else{
            Alert.alert("Verify Email",'Verification Email Sent')
            return;
          }
        }
      })
      // AsyncStorage.setItem('token', user);
    }catch(error){
        console.log(error.message)
        return {
          error: error.message,
          
        }
      }
  } catch (error) {
    console.log(error.message)
    return {
      error: error.message,
    }
  }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await getAuth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}



export const onConnect = () => {
  console.log('onConnect');
  client.subscribe('led');
  var message = new Paho.MQTT.Message("ON");
  message.destinationName = 'led';
  client.send(message);
  console.log("send")

}

const onConnectoff = () => {
  console.log('onConnect');
   client.subscribe('led');
  var message = new Paho.MQTT.Message("OFF");
  message.destinationName = 'led';
  client.send(message);
  console.log("send")

}

const onFailure = () => {
  console.log('Connect failed!');

}

export const mqttSend = async (topic) => {
  console.log("pressed")
    init({
      size: 10000,
      // storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      sync : {}
    });
    const options = {
      host: 'reflow.online',
      port: 8883,
      path: '/led',
      id: 'id_' + parseInt(Math.random()*100000)
    };
    try{
    client = new Paho.MQTT.Client(options.host, options.port, options.path);
    console.log("done")
    }catch(error){
      console.log("defsd");
    }
    client.connect({
            onSuccess: onConnect,
            useSSL: true,
             userName: 'the',
             password:'the',
            timeout: 3,
            onFailure: onFailure
          });
   
    return client;
    //  client.subscribe(topic, { qos: 0 });
    //  var message = new Paho.MQTT.Message("ON");
    //  message.destinationName = topic;
    // client.send(message);

}

export const mqttSendoff = async (topic) => {
  console.log("pressed")
    init({
      size: 10000,
      // storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      sync : {}
    });
    const options = {
      host: 'reflow.online',
      port: 8883,
      path: '/led',
      id: 'id_' + parseInt(Math.random()*100000)
    };
    try{
    client = new Paho.MQTT.Client(options.host, options.port, options.path);
    console.log("done")
    }catch(error){
      console.log("defsd");
    }
    client.connect({
            onSuccess: onConnectoff,
            useSSL: true,
            userName: 'the',
            password:'the',
            timeout: 3,
            onFailure: onFailure
          });
    //  client.subscribe('led', { qos: 0 });
    //  var message = new Paho.MQTT.Message("OFF");
    //  message.destinationName = 'led';
    //  client.send(message);

}


