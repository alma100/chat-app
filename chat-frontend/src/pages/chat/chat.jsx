import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"
import User from "../../icons/user.png"
import Close from "../../icons/close.png"
import Submit from "../../icons/submit.png"
import Minus from "../../icons/minus.png"
import Happiness from "../../icons/happiness.png"
import Emoji from "./emoji";
import DisplayEmoji from "./displayEmoji";

const Chat = ({ profileData, setProfileData }) => {

    const navigate = useNavigate();

    const [searchFieldValue, setSearchFieldValue] = useState(null);
    const [searchFetchRes, setSearchFetchRes] = useState(null);
    const [searchFieldError, setSearchFieldError] = useState(null); //searchField erro handling!!


    const [activeChat, setActiveChat] = useState([]);
    const [pendingChat, setPendingChat] = useState([]);

    //activeChat component
    const [onFocusMessage, setOnFocusMessage] = useState(null);
    const [clickEmojiPicker, setClickEmojiPicker] = useState(null);


    const [allChatData, setAllChatData] = useState([]);

    const [currentChatId, setcurrentChatId] = useState(null);
    const [messageInput, setMessageInput] = useState({});
    const [messageHistory, setMessageHistory] = useState({});

    const [showCloseIcon, setShowCloseIcon] = useState(null);

    const bottomRef = useRef();

    const WS_URL = "ws://localhost:5102/ws";

    const REACTIONS = [
        {
            emoji: "😂",
            label: "joy",
        },
        {
            emoji: "😍",
            label: "love",
        },
        {
            emoji: "😮",
            label: "wow",
        },
        {
            emoji: "🙌",
            label: "yay",
        },
        {
            emoji: "👍",
            label: "up",
        },
        {
            emoji: "👎",
            label: "down",
        },
    ];

    const { sendMessage, lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => console.log('opened'),
        share: true,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        withCredentials: true,
    });


    useEffect(() => {
        var szelesseg = window.innerWidth;
        var magassag = window.innerHeight;

        console.log("Böngésző ablak szélessége: " + szelesseg);
        console.log("Böngésző ablak magassága: " + magassag);

        if (profileData !== null) {
            let message = {
                Event: "connection request",
                UserId: profileData.id,
                Content: null,
                ChatId: null
            };
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage(message);
                getAllChatFetch().then(res => {
                    console.log(res);
                    setAllChatData(res);
                });
            }
        } else {
            refreshProfilData().then(res => {
                console.log(res)
                if (res !== undefined) {
                    console.log(res)
                    setProfileData(res);
                }
            });
        }
    }, [profileData, readyState])


    useEffect(() => {
        if (lastMessage !== null) {
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            if (messageObject.Event !== "connection request") {
                handleIncomingMessage(messageObject.Message, messageObject.Event);
                if (activeChat.length !== 0) {
                    setTimeout(() => {
                        bottomRef.current.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            }
        }
    }, [lastMessage]);


    useEffect(() => {
        console.log("lefut")
        if (activeChat.length !== 0) {
            console.log("lefut1")
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [activeChat])

    const handleIncomingMessage = (messageObj, event) => {

        if (event === "message") {
            handleIncomingMessageEvent(messageObj);
        } else if (event === "add emoji") {
            handleIncomingAddEmojiEvent(messageObj);
        } else if (event === "remove emoji") {
            handleIncomingAddEmojiEvent(messageObj);
        }
    }

    const handleIncomingAddEmojiEvent = (messageObj) => {

        const updatedMessageHistory = { ...messageHistory };

        let message = updatedMessageHistory[messageObj.ChatId].map(m => {
            if (m.MessageId === messageObj.MessageId) {
                return messageObj;
            }
            else {
                return m;
            }
        });
        updatedMessageHistory[messageObj.ChatId] = message;
        setMessageHistory(updatedMessageHistory);
    }

    function messageIsExist(messageList, messageId) {
        return messageList.some(messageObj => messageObj.MessageId === messageId);
    }

    const handleIncomingMessageEvent = (messageObj) => {
        console.log(messageHistory)
        if (messageObj.ChatId in messageHistory) {
            if (!messageIsExist(messageHistory[messageObj.ChatId], messageObj.MessageId)) {
                console.log("incomingIf")
                setMessageHistory({
                    ...messageHistory,
                    [messageObj.ChatId]: [...messageHistory[messageObj.ChatId], messageObj]
                });
            }

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

    const refreshProfilData = () => {
        return fetch('/api/Auth/HowAmI').then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                navigate("/login");
            }
        });
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
                setMessageHistory({
                    ...messageHistory,
                    [res.id]: []
                });
                setAllChatData([...allChatData, res]);
            }
        )
    };


    const chatHandler = (chatDto) => {
        console.log(chatDto.id);
        if (!(chatDto.id in messageHistory)) {

            setMessageHistory({
                ...messageHistory,
                [chatDto.id]: []
            }); //ha mégnem kapott üzenetet DONE ,  + létrehozni és lekérni a régi üzeneteket.!!!
        }

        if (!activeChat.includes(chatDto.id) && !pendingChat.includes(chatDto.id)) {
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
                Emoji: [],
                ChatId: chatId,
            };

            let input = {
                Event: "message",
                UserId: profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }
            sendMessage(JSON.stringify(input));
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

        if (currentActiveChat.length >= 3) {
            let firstChatId = currentActiveChat[0];
            let newOnlineChat = currentActiveChat.slice(1);
            newOnlineChat.push(chatId);
            setActiveChat(newOnlineChat);
            upgradedPedingChat.push(firstChatId)
        } else {
            setActiveChat([...currentActiveChat, chatId])
        }
        setPendingChat(upgradedPedingChat);
        setShowCloseIcon(null);
    }

    const closeMessageInTab = (chatId, e) => {
        e.stopPropagation();  //prevent to trigger the parrent div onClick action.
        let upgradedPedingChat = pendingChat.filter(id => id !== chatId);
        setPendingChat(upgradedPedingChat);
        setShowCloseIcon(null);
    }

    const emojiClickHandler = (messageId) => {

        setClickEmojiPicker(messageId);

    }


    // --------------- Warning methods ----------------------

    const chatMessageWarningHandler = (chatId, index) => {
        setShowCloseIcon(index);

    }

    //----------------- emoji --------------------------------

    const emojiByLabel = (label) => {
        const reaction = REACTIONS.find(reaction => reaction.label === label);
        return reaction ? reaction.emoji : null;
    };

    return (
        <>
            {
                profileData !== null ? (
                    <div>
                        <Navbar />
                        <Box className="chatBox">
                            <Grid container width="100%">
                                <Grid item xs={5} ms={5} md={3} >
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
                                                    return <div key={index} onClick={() => handleSearchButtonClick(name)}
                                                        className="chat-search-result-element">{name.firstName + " " + name.lastName}</div>
                                                })
                                            }
                                        </div>
                                    </div>

                                </Grid>
                                <Grid item xs={0} ms={0} md={7}>

                                </Grid>
                                <Grid item xs={5} ms={5} md={2}>
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
                        </Box>
                        <div id="chatboxRoot">

                            {
                                pendingChat.map((chatId, index) => {
                                    return <>
                                        <div className="pending-chat-container" style={{ bottom: `calc(10px + ${index * 90}px)` }}
                                            onClick={() => messageBackToOnline(chatId)}
                                            key={index}
                                            onMouseEnter={() => chatMessageWarningHandler(chatId, index)}
                                            onMouseLeave={() => setShowCloseIcon(null)}>

                                            <div id={`closeTabChat${index}`}
                                                style={{
                                                    position: 'relative',
                                                    bottom: '5px',
                                                    left: '40px',
                                                    displey: 'flex',
                                                    justifyContent: 'center',
                                                    visibility: showCloseIcon === index ? 'visible' : 'hidden',
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: 'rgb(224, 222, 222)',
                                                    alignItems: 'center',
                                                    borderRadius: '50px',
                                                }}
                                                onClick={(e) => { closeMessageInTab(chatId, e) }}>
                                                <img style={{
                                                    width: '13px',
                                                    height: '13px',
                                                }} src={Close} alt="Close chat tab Icon" />
                                            </div>
                                            {chatId}
                                        </div>
                                        <div id={`messageTabChat${index}`}
                                            style={{
                                                position: 'absolute',
                                                bottom: `calc(15px + ${index * 90}px)`,
                                                right: '110px',
                                                displey: 'flex',
                                                visibility: showCloseIcon === index ? 'visible' : 'hidden',
                                                width: '200px',
                                                height: '50px',
                                                backgroundColor: 'rgb(224, 222, 222)',
                                                alignItems: 'center',
                                                borderRadius: '10px',
                                                padding: '5px'
                                            }}>
                                            Last message content...
                                        </div>
                                    </>

                                })
                            }

                            {
                                activeChat.map((value, index) => {
                                    if (index < 3) {
                                        return <div className="chat-box" style={{ left: `calc(60vw - ${index * 350}px)` }} key={index}>
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
                                                    {
                                                        messageHistory[value].map((message, index) => {
                                                            if (message.UserId === profileData.id) {
                                                                return <div className="chatOwnMessageWrapper"
                                                                    id={message.ChatId + "." + index}
                                                                    onMouseEnter={() => { setOnFocusMessage(message.MessageId) }}
                                                                    onMouseLeave={() => { setOnFocusMessage(null) }}>
                                                                    <div className="owenMessageContainer">
                                                                        <div key={message.ChatId + index}
                                                                            className="chatOwnMessage">
                                                                            {message.Content}
                                                                            <div className="owenChatEmoji" style={{
                                                                                visibility: message.Emoji.length === 0 ? 'hidden' : 'visible',
                                                                            }}>
                                                                                {
                                                                                    message.Emoji.map((value, index) => {
                                                                                        if (index < 3) {
                                                                                            return <DisplayEmoji 
                                                                                            emojiValue={value} 
                                                                                            reactions={REACTIONS}
                                                                                            />
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div style={{
                                                                        display: message.Emoji.length === 0 ? 'none' : 'block',

                                                                    }}>
                                                                    </div>

                                                                </div>
                                                            } else {
                                                                return <div className="chatMessageWrapper"
                                                                    id={message.ChatId + "." + index}
                                                                    onMouseEnter={() => { setOnFocusMessage(message.MessageId), console.log(message.MessageId) }}
                                                                    onMouseLeave={() => { setOnFocusMessage(null), setClickEmojiPicker(null) }}>
                                                                    <div className="messageContentContainer">

                                                                        <img className="chatuserIcon" src={User} alt="chat user Icon" />

                                                                        <div className="messageContainer">
                                                                            <div key={index} className="chatRecivedMessage">
                                                                                {message.Content}
                                                                                <div className="chatEmoji"
                                                                                    style={{
                                                                                        visibility: message.Emoji.length === 0 ? 'hidden' : 'visible',
                                                                                    }}>
                                                                                    {
                                                                                        message.Emoji.map((value, index) => {
                                                                                            if (index < 3) {
                                                                                                return <DisplayEmoji 
                                                                                                emojiValue={value} 
                                                                                                reactions={REACTIONS}
                                                                                                />
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                </div>

                                                                            </div>


                                                                            <div className="addEmoji"
                                                                                style={{
                                                                                    visibility: onFocusMessage === message.MessageId ? 'visible' : 'hidden',
                                                                                }}
                                                                                onClick={() => { emojiClickHandler(message.MessageId) }}>
                                                                                {
                                                                                    clickEmojiPicker === message.MessageId ? (

                                                                                        <Emoji
                                                                                            chatId={message.ChatId}
                                                                                            messageId={message.MessageId}
                                                                                            setMessageHistory={setMessageHistory}
                                                                                            messageHistory={messageHistory}
                                                                                            sendJsonMessage={sendJsonMessage}
                                                                                            reactions={REACTIONS}
                                                                                            profileData={profileData} />

                                                                                    ) : (
                                                                                        <></>
                                                                                    )
                                                                                }

                                                                                <img className="addEmojiIcon" src={Happiness} alt="chat add emoji Icon" />

                                                                            </div>

                                                                        </div>


                                                                    </div>

                                                                </div>
                                                            }

                                                        })


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
                                                        value={messageInput[value] === undefined ? "" : messageInput[value]}
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

                    </div>
                ) : (
                    <div>
                        Waiting for data...
                    </div>
                )
            }


        </>
    )
}

export default Chat;