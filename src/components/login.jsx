import React , {Fragment, useEffect, useState}from 'react';
import useCrossTabState from "./acrossTabStorage";
import Chat from './chat';

const Login = () => {
    const [username, setUsername] = useCrossTabState('username',null);
    const [disabledButton, toggleDisableState] = useCrossTabState('disabledButton',true);
    const [showChat, setShowChat] = useCrossTabState('showChat',false);

    /**
     * Toggles the button state when username is entered
     */
    useEffect(() => {
        toggleDisableState(!username);
    },[username]);

    /**
     * Saves username & adds to the room '0'  by default
     */
    useEffect(() => {
        setUsername(username);
    }, [username]);

    const onSubmit = (e) => {
        e.preventDefault();
        setShowChat(true);
    }

    return (
        <Fragment>
            {
                    showChat
                    ? <Chat username={username}/>
                    : <div className="login-container">
                            <input type="text" name="username" placeholder="username" className="m-b-1"
                                   onChange={(e)=>{
                                       setUsername(e.target.value);
                                       console.log('username is:',username);
                                    }
                                   }
                            />
                            <button className="btn" type="submit"  disabled={disabledButton} onClick={(e) => onSubmit(e)}>Join the doordash
                                chat!
                            </button>
                    </div>
            }
        </Fragment>
    );
};

export default Login;