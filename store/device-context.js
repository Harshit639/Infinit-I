import {createContext,useReducer} from 'react';
import Device from "../models/device";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../src/core/config';
import { getAuth } from '../src/core/config';

export const DEVICES = [
    // new Device('Motor Controller','led','#CEEDC7'),
    // new Device('Smart TV','led','#FFF6BD'),
    // new Device('Washing Machine','led','#FFD4B2'),
    // new Device('Fan','led','#EAFDFC'),
    {
        name: 'Motor Controller',
        topic: 'led',
        color: '#FFD4B2',
        tankheight: '735',
    },
    {
        name: 'Air Conditioner',
        topic: 'led',
        color: '#CEEDC7',
        tankheight: '735',
    },
    {
        name: 'Washing Machine',
        topic: 'led',
        color: '#FFF6BD',
        tankheight: '735',
    }, 
    // {
    //     name: 'Motor Controller',
    //     topic: 'led',
    //     color: '#CEEDC7',
    // }
  ];


  export const ExpenseContext= createContext({
    devices:[],
    addDevice: (devicename,topic,color,tankheight) => {},
    setDevices:(devices)=>{},

});

function expenseReducer(state,action){
    switch(action.type){
        case 'ADD':
            const washingtonRef = doc(db, "users", getAuth().currentUser.uid);
            if(state){
                updateDoc(washingtonRef, {
                    device: [{
                        name:action.payload.devicename,
                        topic: action.payload.topic,
                        color: '#CEEDC7',
                        tankheight: action.payload.tankheight
                    },...state]
                  });
                return [{name:action.payload.devicename,topic:action.payload.topic,color:action.payload.color,tankheight:action.payload.tankheight}, ...state]
            }else{
                updateDoc(washingtonRef, {
                    device: [{
                        name:action.payload.devicename,
                        topic: 'led',
                        color: '#CEEDC7',
                        tankheight: action.payload.tankheight
                        
                    }]
                  });
                return [{name:action.payload.devicename,topic:action.payload.topic,color:action.payload.color,tankheight:action.payload.tankheight}]
            }
            
        
        case 'SET':
            const inverted = action.payload
            return inverted;
}}


function DeviceContextProvider({children}){
    // const [deviceState,dispatch] = useReducer(expenseReducer,DEVICES)
    const [deviceState,dispatch] = useReducer(expenseReducer,)
    function addDevice(devicename,topic,color,tankheight){
        dispatch({type:'ADD', payload: {devicename:devicename , topic:topic, color:color, tankheight:tankheight}})

    }
    function setDevices(devices){
        dispatch({type:'SET',payload: devices})
    }
    

    const value={
        devices:deviceState,
        addDevice: addDevice,
        setDevices: setDevices,

    }


    return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export default DeviceContextProvider;