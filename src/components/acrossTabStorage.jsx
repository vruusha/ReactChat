import React, { useState, useEffect, useRef } from "react";

function useCrossTabState(stateKey,defaultValue) {

    const [state,setState] = useState(JSON.parse(localStorage.getItem(stateKey)) || defaultValue);
    const isNewSession = useRef(true);

    useEffect(()=>{
       if(isNewSession.current){
            const currentState = localStorage.getItem(stateKey);
            if (currentState){
                setState(JSON.parse(currentState));
            } else{
                setState(defaultValue);
            }
            isNewSession.current = false;
            return;
        }
        try {
            localStorage.setItem(stateKey,JSON.stringify(state));
            console.log('Setting data after update fro statekey :', stateKey, 'with value:', state);
        } catch(error){
            console.log('Error while storing data in ');
        }
    },[state,stateKey]);

    useEffect(()=>{
        const onReceieveMessage = (e) => {
            const {key,newValue} = e;
            if(key === stateKey){
                setState(JSON.parse(newValue));
                console.log('updating new value ', newValue, 'for key:', stateKey);
            }
        }
        window.addEventListener('storage',onReceieveMessage);
        return () => window.removeEventListener('storage',onReceieveMessage);

    },[stateKey,setState]);

    return [state,setState];
}

/*function useCrossTabState(stateKey,defaultValue){
    const [state,setState] = useState(defaultValue);
    const isNewSession = useRef(true)
    useEffect(()=>{
        if(isNewSession.current){
            const currentState = localStorage.getItem(stateKey)
            if(currentState){
                setState(JSON.parse(currentState))
            }else{
                setState(defaultValue)
            }
            isNewSession.current=false
            return
        }
        try{
            localStorage.setItem(stateKey,JSON.stringify(state))
        }catch(error){}
    },[state,stateKey,defaultValue])
    useEffect(()=>{
        const onReceieveMessage = (e) => {
            const {key,newValue} = e
            if(key===stateKey){
                setState(JSON.parse(newValue))
            }
        }
        window.addEventListener('storage',onReceieveMessage)
        return () => window.removeEventListener('storage',onReceieveMessage)
    },[stateKey,setState])
    return [state,setState]
}*/

export default useCrossTabState;