import { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"

const Chat = ({profileData}) => {

    const [searchFieldValue, setSearchFieldValue] = useState(null);
    const [searchFetchRes, setSearchFetchRes] = useState(null);
    const [searchFieldError, setSearchFieldError] = useState(null); //searchField erro handling!!

    const [activeChat, setActiveChat] = useState([]);

    const [allChatData, setAllChatData] = useState([]);

    const [currentChatId, setcurrentChatId] = useState(null);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messageHistory, setMessageHistory] = useState({});
  
    const WS_URL = "ws://localhost:5102/ws";
    const { sendMessage, lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage.data)
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            if(messageObject.message !== "connection opend"){
                handleIncomingMessage(messageObject);
            }
            
            console.log("connection")
        }

    }, [lastMessage]);

    useEffect(()=> {
        let message = {
            UserId: profileData.id,
            Content : "connection request",
            ChatId: 0
        }
        sendJsonMessage(message)

        getAllChatFetch().then(res => {
            setAllChatData(res);
        })

    },[])

    useEffect(()=> {
        console.log(messageHistory)
    },[messageHistory])

    const handleIncomingMessage = (messageObj) => {
        
        if(messageObj.ChatId in messageHistory){
            console.log("incomingIf")
            setMessageHistory({
                ...messageHistory,
                [messageObj.ChatId]: [...messageHistory[messageObj.ChatId], messageObj]
            });
        }else{
            console.log("incomingElse")
            setMessageHistory({
                ...messageHistory,
                [messageObj.ChatId]: [messageObj]
            });
            getAllChatFetch().then(res => {
                setAllChatData(res);
            })
        }
    }   

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
        
        if (messageInput !== "" && currentChatId !== null) {
            console.log("qwer")
            let message = {
                UserId: profileData.id,
                Content : messageInput,
                ChatId: currentChatId
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
        if(searchFieldValue.length > 0){
            searchFetch(nameObj).then(res=> {
                setSearchFetchRes(res);
            })
        }else{
            //error kezelés
        }
        
    }

    const handleSearchButtonClick = (name) => {
       
        let chatObj = {
            UsersId: [name.id, profileData.id]
        }

        createChatFetch(chatObj).then(
            res=> {
                console.log(res)
                setcurrentChatId(res.id);
                setCurrentChatUser(res.usersFullName[0]);
                setMessageHistory({
                    ...messageHistory,
                    [res.id]: []
                });
                setAllChatData([...allChatData, res]);
            }
        )
    };

    const chatHandler = (chatDto) =>{
        console.log(chatDto.id);
        setcurrentChatId(chatDto.id);

        if(!(chatDto.id in messageHistory)){
           
            setMessageHistory({
                ...messageHistory,
                [chatDto.id]: []
            }); //ha mégnem kapott üzenetet DONE ,  + létrehozni és lekérni a régi üzeneteket.!!!
        }
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
                                    return <div key={index}  onClick={() => handleSearchButtonClick(name)}>{name.firstName+" "+name.lastName}</div>
                                })
                            }
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        {/*
                            <div>
                           {currentChatUser === null ? "No chat selected" : currentChatUser}
                        </div>
                        <div id="chatField">
                            { currentChatId !== null ? (
                                messageHistory[currentChatId].map((message, index) => {
                                    if (message.UserId === profileData.id) {
                                        return <div className="chatOwnMessageWrapper"><div key={index} className="chatOwnMessage">{message.Content}</div>
                                            <span className="chatOwnProfile"><img className="ownChatuserIcon" src={User} alt="Show password Icon" /></span></div>
                                    } else {
                                        return <div className="chatMessageWrapper"><span className="chatOwnProfile">
                                            <img className="chatuserIcon" src={User} alt="Show password Icon" /></span>
                                            <div key={index} className="chatRecivedMessage">{message.Content}</div>
                                        </div>
                                    }
    
                                })
                               
                            ) : (
                                <div>

                                </div>
                            )
                            }
                        </div>
                        <div id="chatInputContainer">
                            <input
                                type="text"
                                onChange={(e) => { setMessageInput(e.target.value) }}
                                value={messageInput}
                            >
                            </input>
                            <div onClick={(e) => sendButtonHandler(e)}>Submit</div>
                        </div>*/
                        }   
                    </Grid>
                    <Grid item xs={3}>
                        <div id="allChatContainer">
                            {
                                allChatData && allChatData.map((value, index)=>{
                                    return <div className="allChatContentDiv"
                                    onClick={()=> {chatHandler(value)}}>{value.usersFullName[0]}</div>
                                })
                            }
                        </div>
                    </Grid>
                </Grid>
                <div id="chatboxRoot">

                </div>
            </Box>

        </>
    )
}

export default Chat;