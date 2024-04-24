import { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"
import Close from "../../icons/close.png"
import Submit from "../../icons/submit.png"
import Minus from "../../icons/minus.png"

const Chat = ({ profileData }) => {

    const [searchFieldValue, setSearchFieldValue] = useState(null);
    const [searchFetchRes, setSearchFetchRes] = useState(null);
    const [searchFieldError, setSearchFieldError] = useState(null); //searchField erro handling!!

    const [activeChat, setActiveChat] = useState([]);
    const [pendingChat, setPendingChat] = useState([]);

    const [allChatData, setAllChatData] = useState([]);

    const [currentChatId, setcurrentChatId] = useState(null);
    //const [currentChatUser, setCurrentChatUser] = useState(null);
    const [messageInput, setMessageInput] = useState({});
    const [messageHistory, setMessageHistory] = useState({});

    const bottomRef = useRef();

    const WS_URL = "ws://localhost:5102/ws";
    const { sendMessage, lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage.data)
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            if (messageObject.message !== "connection opend") {
                handleIncomingMessage(messageObject);
                if (activeChat.length !== 0) {
                    setTimeout(() => {
                        bottomRef.current.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            }

            console.log("connection")
        }
        console.log(bottomRef)
    }, [lastMessage]);

    useEffect(() => {
        let message = {
            UserId: profileData.id,
            Content: "connection request",
            ChatId: 0
        }
        sendJsonMessage(message)

        getAllChatFetch().then(res => {
            console.log(res)
            setAllChatData(res);
        })

    }, [])

    useEffect(() => {
        if (activeChat.length !== 0) {
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [activeChat])

    const handleIncomingMessage = (messageObj) => {

        if (messageObj.ChatId in messageHistory) {
            console.log("incomingIf")
            setMessageHistory({
                ...messageHistory,
                [messageObj.ChatId]: [...messageHistory[messageObj.ChatId], messageObj]
            });
        } else {
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
        return fetch("/api/Chat/creatChat", {
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




    const chatSearchHandler = () => {
        console.log(searchFieldValue)
        let nameObj = {
            name: searchFieldValue
        }
        if (searchFieldValue.length > 0) {
            searchFetch(nameObj).then(res => {
                setSearchFetchRes(res);
            })
        } else {
            //error kezelés
        }

    }

    const handleSearchButtonClick = (name) => {

        let chatObj = {
            UsersId: [name.id, profileData.id]
        }

        createChatFetch(chatObj).then(
            res => {
                console.log(res)
                setcurrentChatId(res.id);
                //setCurrentChatUser(res.usersFullName[0]);
                setMessageHistory({
                    ...messageHistory,
                    [res.id]: []
                });
                setAllChatData([...allChatData, res]);
            }
        )
    };

    useEffect(()=> {
        console.log(activeChat);
    },[activeChat])

    const chatHandler = (chatDto) => {
        console.log(chatDto.id);
        if (!(chatDto.id in messageHistory)) {

            setMessageHistory({
                ...messageHistory,
                [chatDto.id]: []
            }); //ha mégnem kapott üzenetet DONE ,  + létrehozni és lekérni a régi üzeneteket.!!!
        }
        //setCurrentChatUser(chatDto.usersFullName[0]);  //valószínű már nem kell

        if (!activeChat.includes(chatDto.id) && !pendingChat.includes(chatDto.id)) {
            /*if(activeChat.length < 3){
                setActiveChat([...activeChat, chatDto.id]);
            }else{
                let currentActiveChat = [...activeChat];
                let firstChatId = currentActiveChat[0];
                setPendingChat([...pendingChat, firstChatId]);
                let newOnlineChat = currentActiveChat.slice(1);
                newOnlineChat.push(chatDto.id);
                setActiveChat(newOnlineChat);
            }*/
            messageBackToOnline(chatDto.id);
        }
    }
    //-------------- onlineChat methods --------------
    const closeChatBox = (id) => {
        const updatedList = activeChat.filter(number => number !== id)
        setActiveChat(updatedList);
    }

    const sendButtonHandler = (chatId) => {

        if (messageInput[chatId] !== "") {
            let message = {
                UserId: profileData.id,
                Content: messageInput[chatId],
                ChatId: chatId
            };
            sendMessage(JSON.stringify(message));
        }

        saveOrUpdateMessages(chatId, "");
    }

    const saveOrUpdateMessages = (chatId, message) => {

        const updatedMessages = { ...messageInput };

        updatedMessages[chatId] = message;

        console.log(updatedMessages)
        setMessageInput(updatedMessages);
    }

    const sendMessageToTab = (chatId) => {
        closeChatBox(chatId);
        setPendingChat([...pendingChat, chatId]);
    }

    const messageBackToOnline = (chatId) => {
        console.log(chatId);
        let currentActiveChat = [...activeChat];
        let upgradedPedingChat = pendingChat.filter(id => id !== chatId);

        if(currentActiveChat.length >= 3){
            let firstChatId = currentActiveChat[0];
            let newOnlineChat = currentActiveChat.slice(1);
            newOnlineChat.push(chatId);
            setActiveChat(newOnlineChat);
            upgradedPedingChat.push(firstChatId)
        }else{
            setActiveChat([...currentActiveChat, chatId])
        }
        setPendingChat(upgradedPedingChat);
    }

    return (
        <>
            <Navbar />
            <Box className="chatBox">
                <Grid container width="100%">
                    <Grid item xs={4} >
                        <div className="chatGrid">
                            <div id="searchBarContainer">
                                <input type="text"
                                    onChange={(e) => { setSearchFieldValue(e.target.value) }}>
                                </input>
                                <div id="chatSearchButton"
                                    onClick={() => { chatSearchHandler() }}>
                                    Search
                                </div>
                            </div>
                            <div id="searchResultContainer">
                                {
                                    searchFetchRes &&
                                    Object.values(searchFetchRes).map((name, index) => {
                                        return <div key={index} onClick={() => handleSearchButtonClick(name)}>{name.firstName + " " + name.lastName}</div>
                                    })
                                }
                            </div>
                        </div>

                    </Grid>
                    <Grid item xs={5}>

                    </Grid>
                    <Grid item xs={3} >
                        <div className="chatGrid">

                            <div id="allChatContainer">
                                <div>Chats</div>
                                {
                                    allChatData && allChatData.map((value, index) => {
                                        return <div className="allChatContentDiv"
                                            onClick={() => { chatHandler(value) }}>{value.usersFullName[0]}</div>
                                    })
                                }
                            </div>
                        </div>

                    </Grid>
                </Grid>
                <div id="chatboxRoot">

                    {
                        pendingChat.map((chatId, index) => {
                            return <div className="pending-chat-container" style={{ bottom: `calc(2vw + ${index * 6}vw)` }}
                            onClick={()=>messageBackToOnline(chatId)}
                            key={index}>
                                {chatId}
                            </div>
                        })
                    }

                    {
                        activeChat.map((value, index) => {
                            if (index < 3) {
                                return <div className="chat-box" /*style={{ left: 80 - index * 3 +'vw' }}*/ style={{ left: `calc(60vw - ${index * 20}vw)` }} key={index}>
                                    <div className="chat-box-header">
                                        <div className="chat-box-header-elements">
                                            {
                                                allChatData.map(obj => {
                                                    if (obj.id == value) {
                                                        return obj.usersFullName[0];
                                                    }
                                                })
                                            }
                                        </div>
                                        <div className="chat-box-toggle">
                                            <span onClick={() => { sendMessageToTab(value) }}
                                                className="chat-box-toggle-element">
                                                <img className="onlineChatMinusIcon" src={Minus} alt="Close chat tab Icon" />
                                            </span>
                                            <span onClick={() => { closeChatBox(value) }}
                                                className="chat-box-toggle-element">
                                                <img className="onlineChatCloseIcon" src={Close} alt="Close chat tab Icon" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="chat-box-body">
                                        <div className="chat-box-overlay">
                                            {currentChatId !== null ? (
                                                messageHistory[value].map((message, index) => {
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
                                            <div id="bottom-reference" ref={bottomRef} />
                                        </div>

                                    </div>
                                    <div className="chat-input">
                                        <div className="onlie-Chat-Input-Container">
                                            <input
                                                type="text"
                                                onChange={(e) => { saveOrUpdateMessages(value, e.target.value) }}
                                                className="registrationInput"
                                                value={messageInput[value]}
                                            >
                                            </input>
                                            <div onClick={() => sendButtonHandler(value)}
                                                className="online-chat-send-Button-div">
                                                <img className="online-chat-icon" src={Submit} alt="Show password Icon" />
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            }

                        })
                    }
                </div>
            </Box>

        </>
    )
}

export default Chat;