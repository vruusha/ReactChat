import React , {Fragment, useEffect, useState, useRef} from 'react';
import useCrossTabState from "./acrossTabStorage";

const Chat = (props) => {
    const {username} = props;
    const [timer, setTimer] = useState(0);
    const [rooms, setRooms] = useCrossTabState('rooms',[]);
    const [selectedRoomID, setSelectedRoomID] = useCrossTabState('selectedRoomID','');
    const [selectedRoomMembers, setSelectedRoomMembers] = useCrossTabState('selectedRoomMembers',null);
    const [selectedRoomMessages, setSelectedRoomMessages] = useCrossTabState('selectedRoomMessages',[]);
    const [newMessage, setNewMessage] = useState('');
    const [newMessageAdded, setNewMessageAdded] = useCrossTabState('newMessageAdded',false);
    const [disabledChatButton, toggleDisabledChatState] = useCrossTabState('disabledChatButton',true);
    const messageEndRef = useRef('',null);

    /**
     * Timer for online status
     */
    useEffect(() => {
        (() => {
            var i = 0;
            setInterval(()=> {
                setTimer(i++);
            }, 60000);
        })();
    }, []);

    /**
     * Scrolls the screen to the bottom when a new message is added
     * Always show the new messages in viewport
     */
    const scrollToBottom = () =>{
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [newMessageAdded]);

    /**
     * Room Details API
     */
    useEffect(()=>{
        fetch('http://localhost:8080/api/rooms')
            .then(response => response.json())
            .then(data => {
                setRooms(data);
                setSelectedRoomID(data[0].id);
            })
            .catch((error) => {
                console.log('error fetching rooms data', error);
            }).then(scrollToBottom);
    },[]);

    /**
     * Messages API
     */
    useEffect(()=>{
        if (selectedRoomID !== '' || !!newMessageAdded) {
            fetch('/api/rooms/' + selectedRoomID + '/messages')
                .then(response=>response.json())
                .then (data=> {
                    setSelectedRoomMessages(data);
                    setNewMessageAdded(false);
                }).catch((error)=>{
                console.log('error fetching chat details for room:', selectedRoomID);
            }).then(scrollToBottom);
        }

    },[selectedRoomID, newMessageAdded]);

    /**
     * On toggle of the rooms fetches Room & Message API
     */

    useEffect(()=>{
        if (selectedRoomID !== '') {
            fetch('/api/rooms/' + selectedRoomID )
                .then(response=>response.json())
                .then (data=> {
                    console.warn(data);
                    setSelectedRoomMembers(data.users);
                }).catch((error)=>{
                console.log('error fetching chat details for roomMembers:', selectedRoomID);
            });
        }
    },[selectedRoomID]);

    /**
     * Toggles the button on input of message
     */

    useEffect(() => {
        toggleDisabledChatState(!newMessage);
    },[newMessage]);

    /**
     * Saving messages to API
     * @param
     */

    function onSubmit (e) {
        e.preventDefault();
        if (!newMessage) {
            return;
        }
        /**
         * Adding messages to the chat
         * saving message to database
         */

        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        }

        postData('/api/rooms/' + selectedRoomID + '/messages', {name: username, message: newMessage})
            .then(data => {
                setNewMessageAdded(true);
                setNewMessage('');
                console.log(data); // JSON data parsed by `data.json()` call
            });
    }

    const getRoomMembers = (selectedRoomMembers, username)=> {
        if (!username) {
            return;
        }

        var memberNames = '';

        if (selectedRoomMembers  && selectedRoomMembers.length > 0) {
            selectedRoomMembers.map( (d, index, selectedRoomMembers) => {
                memberNames = username !== d ? ` ${memberNames} ${d} , `: memberNames;
            });
        }
        return memberNames.substring(0, memberNames.trim().length - 1);
    }

    return (
        <Fragment>
            <div className="chat-window">
                <div className="left-panel">
                    <div className="user-details">
                        <h2 className="name"> {username}</h2>
                        <div className="status">online since: {timer} minutes</div>
                    </div>
                    <div className="chat-rooms">
                        {rooms.map( (d,index) => <div className={`room ${index === selectedRoomID ? 'active' : ''} `} onClick={()=>setSelectedRoomID(d.id)}>{d.name}</div>)}
                    </div>
                </div>

                <div className="right-panel">
                    <div className="header">
                        <h4>{rooms  && rooms.length && (selectedRoomID !== '') > 0 ? rooms.find(room => room.id === selectedRoomID).name : ''}</h4>
                        <div><span className="highlight-color">{`${username}, `}</span><span>{getRoomMembers(selectedRoomMembers, username)}</span></div>
                    </div>
                    <div className="message-container">
                        <h4>Chat Room</h4>
                        {selectedRoomMessages && selectedRoomMessages.length > 0 && selectedRoomMessages.map( d => <div><div className="username">{d.name}</div><div className="message">{d.message}</div></div>)}
                        <div ref={messageEndRef}></div>
                    </div>
                    <div className="footer">
                        <input type="text" name="message" value={newMessage} onChange={(e)=>{
                            setNewMessage(e.target.value);
                        }}/>
                        <button className="btn btn-link"  disabled={disabledChatButton} type="submit"  onClick={onSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Chat;