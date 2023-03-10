import { StyleSheet, Text, View,Image, Pressable,ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Ionicons} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logoutUser } from '../api/auth-api'
// import firebase from 'firebase/compat/app';
//  import {firebase} from '../core/config'
//  import 'firebase/auth'

import AsyncStorage from '@react-native-async-storage/async-storage';

import Background from '../components/Background'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs, documentId } from "firebase/firestore";
import { db } from '../core/config'

    //  const email = firebase.auth().currentUser.email
    //  const name = firebase.auth().currentUser.displayName

    //  const email = "fdsfcdsv"
    //  const name = "dffsdv"
 



// cXonst imageUrl = 'https://images.unsplash.com/photo-1673095025656-233e3973075b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80';

const ProfileScreen = () => {
    
    const [data, setdata] = useState('')
    const [email,setemail] = useState('')
    const [name,setName]= useState('')
    // const [uidx,setuid]= useState('')
   
    useEffect(()=>{
        getDocs( query(collection(db, "users"), where(documentId(), "==", getAuth().currentUser.uid ))).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
                setdata(doc.data())
            });
        });
        setemail(getAuth().currentUser.email)
        setName(getAuth().currentUser.displayName)
    },[])

    
    // useEffect(()=>{
    //     async function fetchToken() {
    //         const storedToken = await AsyncStorage.getItem('name');
    //         const storedToken2 = await AsyncStorage.getItem('email');
    //         const storedToken3 = await AsyncStorage.getItem('uid');
    //         setemail(storedToken2);
    //         setName(storedToken);  
    //         setuid(storedToken3);
    //         console.log(storedToken3)
    //         firebase.firestore().collection('users').
    //         doc(storedToken3).get()
    //         .then((snapshot)=>{
    //             if(snapshot.exists){
    //                 setdata(snapshot.data())
    //             }else{
    //                 console.log("User does not exist")
    //             }
    //         })

    //       }
    //       fetchToken();
        //   console.log(firebase.auth().currentUser.uid);
        //   console.log(firebase.auth().currentUser.uid);
        //   console.log(firebase.auth().currentUser.uid);
        // setemail(firebase.auth().currentUser.email)
        // setName(firebase.auth().currentUser.displayName)
    // },[])
    //    console.log(firebase.auth().currentUser.uid);
    //       console.log(firebase.auth().currentUser.uid);
    //       console.log(firebase.auth().currentUser.uid);
   

    const phoneNo = data.phoneNo
    console.log(phoneNo)

  console.log(email)
  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}
    >
    <SafeAreaView style={styles.screen}>
        
    <View style={styles.mainscreen}>
    <View style={styles.imgbox}>
    <Image source={require('../assets/profile.png')} style={styles.image} />
    <Text style={styles.nametext}>{name}</Text>
    <Text style={styles.addresstexrt}>Chennai, India</Text>
    </View>

     
    <View style={styles.emailbox}>
    <Ionicons name='mail' color='white' size={24}/>
    <Text style={styles.text}>{email}</Text>
    </View>
    
        <View style={styles.emailbox}>
        <Ionicons name='ios-umbrella-sharp' color='white' size={24}/>
        <Text style={styles.text}>+91 {phoneNo}</Text>
        </View>

        <View style={styles.signout}> 
        <Pressable android_ripple={{color: '#ccc'}} style={({pressed})=>(pressed? styles.pressed : null)} onPress={()=>{getAuth().signOut()}}  >
        <Text style={styles.signouttext}> SIGN OUT </Text>
        </Pressable>
    </View>
    </View>

    
    </SafeAreaView>
    </ImageBackground>
   

  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    background:{
        flex:1,
    },
    screen:{
        flex:1,
        // backgroundColor:'#EAFDFC'
    },
    mainscreen:{
        flex:1,
        marginTop:100,
        alignItems:'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 8,
        marginTop:-70
      },
    imgbox:{
        padding:25,
        backgroundColor:'#82AAE3',
        width:'85%',
        justifyContent:'center',
        alignItems:'center',
        elevation: 4,
        borderRadius:16,
        shadowColor: 'black',
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:8,
    },
    emailbox:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#2DCDDF',
    
        padding:10,
        marginTop:30,
        width:'85%',
        elevation: 4,
        borderRadius:10,
        shadowColor: 'black',
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:8,
    },
    text:{
        color:'white',
        fontSize:16,
        marginLeft:15,
        fontWeight:"bold"
    },
    nametext:{
        color:'white',
        fontSize:20,
        fontWeight:'bold'


    },
    addresstexrt:{
        color:'white',
        fontSize:15,
        fontStyle:'italic'
    },
    signout:{
        marginTop:50,
        justifyContent:'center',
        alignItems:'center',
      
        width:'50%',
        borderRadius:8,
        backgroundColor:"#EB455F"
    },
    signouttext:{
        padding:10,
        paddingVertical:15,
        fontSize:15,
        color:'white',
        fontWeight:'bold',
    }
})