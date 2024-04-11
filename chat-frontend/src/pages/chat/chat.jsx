import { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"

const Chat = () => {

    const [messageInput, setMessageInput] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    const [updateMessage, setUpdateMessage] = useState(false);

    const WS_URL = "ws://localhost:5102";
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            setMessageHistory(prevMessages => [...prevMessages, messageObject]);
        }
    }, [lastMessage]);


    const sendButtonHandler = () => {
        if (messageInput !== "") {
            let message = {
                userId: 1,
                data: messageInput
            }
            sendMessage(JSON.stringify(message));
        }

        setMessageInput("");
    }

    return (
        <>
            <Navbar />
            <Box className="chatBox">
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <div id="searchBarContainer">
                            <input type="text">
                            </input>
                            <div id="chatSearchButton">
                                Search
                            </div>
                        </div>
                        <div id="searchResultContainer">

                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div id="chatField">
                            {messageHistory.map((message, index) => {
                                if (message.userId === 0) {
                                    return <div className="chatOwnMessageWrapper"><div key={index} className="chatOwnMessage">{message.data}</div>
                                        <span className="chatOwnProfile"><img className="chatuserIcon" src={User} alt="Show password Icon" /></span></div>
                                } else {
                                    return <div className="chatMessageWrapper"><span className="chatOwnProfile">
                                        <img className="chatuserIcon" src={User} alt="Show password Icon" /></span>
                                        <div key={index} className="chatRecivedMessage">{message.data}</div>
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