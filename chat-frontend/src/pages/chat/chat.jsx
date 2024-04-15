import { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"

const Chat = ({profileData}) => {

    const [searchFieldValue, setSearchFieldValue] = useState(null);

    const [messageInput, setMessageInput] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    let userId = profileData === null ? "0" : profileData.id;
    const WS_URL = "ws://localhost:5102/ws";
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            setMessageHistory(prevMessages => [...prevMessages, messageObject]);
        }

        console.log("aísad")
    }, [lastMessage]);


    const searchFetch = (name) => {
        fetch(`/api/Chat/getUserByName?name=${name}`).then(
            res => res.json()
        )
    }

    const sendButtonHandler = () => {
        if (messageInput !== "") {
            let message = {
                UserId: userId,
                Content : messageInput,
                ChatId: "10"
            }
            sendMessage(JSON.stringify(message));
        }

        setMessageInput("");      
    }


    const chatSearchHandler = () => {
        searchFetch(searchFieldValue).then(res=> {
            console.log(res)
        })
    }
    
    return (
        <>
            <Navbar />
            <Box className="chatBox">
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <div id="searchBarContainer">
                            <input type="text"
                                onChange={(e)=> {setSearchFieldValue(e.target.value)}}>
                            </input>
                            <div id="chatSearchButton"
                                onClick={()=> {chatSearchHandler()}}>
                                Search
                            </div>
                        </div>
                        <div id="searchResultContainer">

                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div id="chatField">
                            {messageHistory.map((message, index) => {
                                if (message.UserId === userId) {
                                    return <div className="chatOwnMessageWrapper"><div key={index} className="chatOwnMessage">{message.Content}</div>
                                        <span className="chatOwnProfile"><img className="ownChatuserIcon" src={User} alt="Show password Icon" /></span></div>
                                } else {
                                    return <div className="chatMessageWrapper"><span className="chatOwnProfile">
                                        <img className="chatuserIcon" src={User} alt="Show password Icon" /></span>
                                        <div key={index} className="chatRecivedMessage">{message.Content}</div>
                                    </div>
                                }

                            })}
                        </div>
                        <div id="chatInputContainer">
                            <input
                                type="text"
                                onChange={(e) => { setMessageInput(e.target.value) }}
                                value={messageInput}
                            >
                            </input>
                            <div onClick={(e) => sendButtonHandler(e)}>Submit</div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        All chats
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default Chat;