import { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"

const Chat = ({profileData}) => {

    const [searchFieldValue, setSearchFieldValue] = useState(null);
    const [searchFetchRes, setSearchFetchRes] = useState(null);

    const [allChatData, setAllChatData] = useState(null);

    const [newChatId, setNewChatId] = useState(null);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    //let userId = profileData === null ? "0" : profileData.id;
    const WS_URL = "ws://localhost:5102/ws";
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage.data)
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            if(messageObject.message !== "connection opend"){
                setMessageHistory(prevMessages => [...prevMessages, messageObject]);
            }
            
            console.log("connection")
        }

        console.log("aísad")
    }, [lastMessage]);

    useEffect(()=> {
        let message = {
            UserId: profileData.id,
            Content : "connection request",
            ChatId: 0
        }
        sendMessage(JSON.stringify(message))

        getAllChatFetch().then(res => {
            console.log(res)
            setAllChatData(res);
        })

    },[])

    useEffect(()=> {

    },[newChatId])


    const searchFetch = (name) => {
        return fetch("/api/Chat/getUserByName", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(name),
        }).then(
            res => res.json()
        )
    }

    const createChatFetch = (data) => {
        return fetch("/api/Chat/creatChat",  {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(
            res => res.json()
        )
    }

    const getAllChatFetch = () => {
        return fetch("/api/Chat/getAllChat").then(res => res.json())
    }

    const sendButtonHandler = () => {
        
        if (messageInput !== "" && newChatId !== null) {
            console.log("qwer")
            let message = {
                UserId: profileData.id,
                Content : messageInput,
                ChatId: newChatId
            };
            sendMessage(JSON.stringify(message));
        }

        setMessageInput("");      
    }


    const chatSearchHandler = () => {
        console.log(searchFieldValue)
        let nameObj = {
            name: searchFieldValue
        }
        searchFetch(nameObj).then(res=> {
            setSearchFetchRes(res);
        })
    }

    const handleDivClick = (name) => {
        console.log("Clicked on div with valuse:", name ); //name.id --> név identity id-a

        let chatObj = {
            UsersId: [name.id, profileData.id]
        }

        createChatFetch(chatObj).then(
            res=> {
                console.log(res); //ez qurvára undefined!!!
                setNewChatId(res.id);
                setCurrentChatUser(res.usersFullName[0]);
            }
        )
    };

    const chatHandler = (chatDto) =>{
        console.log(chatDto);
        setNewChatId(chatDto.id);
        setCurrentChatUser(chatDto.usersFullName[0]);
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
                            {
                                searchFetchRes && 
                                Object.values(searchFetchRes).map((name, index) => {
                                    return <div key={index}  onClick={() => handleDivClick(name)}>{name.firstName+" "+name.lastName}</div>
                                })
                            }
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div>
                           {currentChatUser === null ? "No chat selected" : currentChatUser}
                        </div>
                        <div id="chatField">
                            {messageHistory.map((message, index) => {
                                if (message.UserId === profileData.id) {
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
                        <div id="allChatContainer">
                            {
                                allChatData && allChatData.map((value, index)=>{
                                    //console.log(value.usersFullName[0])
                                    return <div onClick={()=> {chatHandler(value)}}>{value.usersFullName[0]}</div>
                                })
                            }
                        </div>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default Chat;