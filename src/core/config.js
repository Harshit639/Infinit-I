// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'
// import firebase from 'firebase/';
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyC03PJ2PuAegQQyxxeFBBjcHVPX9xtSELM",
   authDomain: "reflow-react-authentication.firebaseapp.com",
   projectId: "reflow-react-authentication",
   storageBucket: "reflow-react-authentication.appspot.com",
   messagingSenderId: "104270530751",
   appId: "1:104270530751:web:11f6d85387bd581332de0a"
 };


//  if(!firebase.apps.length){
//    firebase.initializeApp(firebaseConfig)
//  }else{
//   firebase.app()
//  }

//  export {firebase};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// export {firebase};
export {getAuth}
export {signInWithEmailAndPassword}
export {createUserWithEmailAndPassword}
export {db}