import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./chat.css"

import Close from "../../icons/close.png"


import ActiveChat from "./activeChat";

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
    const [messageHistoryIndex, setMessageHistoryIndex] = useState({})


    const [showCloseIcon, setShowCloseIcon] = useState(null);

    const [bottomRefe, setBottomRef] = useState([])
    const [scrollPosition, setScrollPosition] = useState([]);
    const [scrollRefe, setScrollRef] = useState([]);

    const bottomRef = useRef(null);

    const scrollRef = useRef(null);

    const WS_URL = "ws://localhost:5102/ws";

    const initialIndex = 10;

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

                handlePrevMessage();
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
                incrementMessageHistoryIndex(messageObject.Message.ChatId);
                if (activeChat.length !== 0) {
                    if (isScrolledChat(messageObject.Message.ChatId)) {
                        scrollBottom(messageObject.Message.ChatId)
                    } else {
                        //set visible autoscroll button
                    }
                }
            }
        }
    }, [lastMessage]);


    useEffect(() => {
        if (activeChat.length > 0 || (activeChat.length === 0 && bottomRefe !== 0)) {
            handleBottomReference();
        }
    }, [activeChat])

    const incrementMessageHistoryIndex = (chatId) => {
        let updatedSplitedMessage = { ...messageHistoryIndex };

        if (chatId in messageHistoryIndex && messageHistoryIndex[chatId] !== 0) {
            let newIndex = updatedSplitedMessage[chatId] +1;

            updatedSplitedMessage[chatId] = newIndex;
            setMessageHistoryIndex(updatedSplitedMessage);
        }
    }

    const creatDefaultMessHistoryValue = (currentIndex) => {

        let updatedSplitedMessage = { ...messageHistoryIndex };

        if (!(currentIndex in messageHistoryIndex)) {

            updatedSplitedMessage[currentIndex] = initialIndex
            setMessageHistoryIndex(updatedSplitedMessage)

        }
    }

    


    const handlePrevMessage = async () => {

        var res = await getAllMessage();

        let upgradeMessageHistory = { ...messageHistory }

        Object.entries(res).forEach(chatKeyValue => {

            let chatId = chatKeyValue[0];
            let chatMessage = chatKeyValue[1]
            upgradeMessageHistory[chatId] = chatMessage;

        })

        setMessageHistory(upgradeMessageHistory);

    }

    const isScrolledChat = (currentChatId) => {

        let isScrolled = scrollPosition.filter(obj => obj.chatId === currentChatId);

        if (isScrolled.length === 0 || isScrolled[0].position === true) {
            return true;
        }

        return false;
    }

    const scrollBottom = (currentChatId) => {
        setTimeout(() => {

            let index = -1;

            activeChat.forEach((id, i) => {
                if (id === currentChatId) {
                    index = i
                }
            })

            console.log(bottomRefe)
            bottomRefe[index].scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    const handleBottomReference = () => {

        if (bottomRefe.length < activeChat.length) {


            let currentChatId = activeChat[activeChat.length - 1]

            setScrollRef([...scrollRefe, scrollRef.current])
            setBottomRef([...bottomRefe, bottomRef.current]);

            if (isScrolledChat(currentChatId)) {
                bottomRef.current.scrollIntoView();
            } else {
                let index = -1;

                scrollPosition.forEach((obj, i) => {
                    if (obj.chatId === currentChatId) {
                        index = i
                    }
                })

                scrollRef.current.scrollTop = scrollPosition[index].position;
            }

        } else if (bottomRefe.length > activeChat.length) {
            let upgradeBottomRef = bottomRefe.slice(0, -1);
            let upgradeScrollRef = scrollRefe.slice(0, -1);
            setScrollRef(upgradeScrollRef);
            setBottomRef(upgradeBottomRef);

            activeChat.forEach((chatId, slotIndex) => {

                let isScrolled = false;
                let index = 0
                scrollPosition.forEach((scrollObj, i) => {
                    if (chatId === scrollObj.chatId) {
                        isScrolled = true;
                        index = i
                    }
                })

                if (isScrolled && scrollPosition[index].position !== true) {
                    upgradeScrollRef[slotIndex].scrollTop = scrollPosition[index].position;
                } else {
                    upgradeBottomRef[slotIndex].scrollIntoView();
                }

            })

        } else {
            activeChat.forEach((chatId, slotIndex) => {
                let isScrolled = false;
                let index = 0
                scrollPosition.forEach((scrollObj, i) => {
                    if (chatId === scrollObj.chatId) {
                        isScrolled = true;
                        index = i
                    }
                })


                if (isScrolled && scrollPosition[index].position !== true) {
                    scrollRefe[slotIndex].scrollTop = scrollPosition[index].position;
                } else {
                    bottomRefe[slotIndex].scrollIntoView();
                }
            })

        }
    }


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

    const getAllMessage = async () => {
        const res = await fetch("/ws/Message/GetAllChatMessage");

        return res.json();
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

    const searchFetch = async (name) => {
        const res = await fetch("/api/Chat/getUserByName", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(name),
        });
        return await res.json();
    }

    const createChatFetch = async (data) => {
        const res = await fetch("/api/Chat/creatChat", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await res.json();
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
                if (res.status !== 400) {
                    setcurrentChatId(res.id);
                    setMessageHistory({
                        ...messageHistory,
                        [res.id]: []
                    });
                    setAllChatData([...allChatData, res]);
                } else {
                    console.log("chat exist") //TODO list!! :(
                }

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
            creatDefaultMessHistoryValue(chatDto.id)
            
        } else if (!activeChat.includes(chatDto.id) && pendingChat.includes(chatDto.id)) {
            const updatedPendingList = pendingChat.filter(number => number !== chatDto.id);
            setPendingChat(updatedPendingList)
            messageBackToOnline(chatDto.id);
        }

    }
    //-------------- onlineChat methods --------------

    const messageBackToOnline = (chatId) => {
        console.log("belépett");
        console.log(scrollPosition)
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




    // --------------- Warning methods ----------------------

    const chatMessageWarningHandler = (chatId, index) => {
        setShowCloseIcon(index);

    }

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
                                        return <ActiveChat
                                            index={index}
                                            value={value}
                                            allChatData={allChatData}
                                            messageHistory={messageHistory}
                                            setOnFocusMessage={setOnFocusMessage}
                                            REACTIONS={REACTIONS}
                                            setClickEmojiPicker={setClickEmojiPicker}
                                            onFocusMessage={onFocusMessage}
                                            clickEmojiPicker={clickEmojiPicker}
                                            bottomRef={bottomRef}
                                            messageInput={messageInput}
                                            setMessageInput={setMessageInput}
                                            activeChat={activeChat}
                                            setActiveChat={setActiveChat}
                                            sendMessage={sendMessage}
                                            profileData={profileData}
                                            setPendingChat={setPendingChat}
                                            setMessageHistory={setMessageHistory}
                                            sendJsonMessage={sendJsonMessage}
                                            pendingChat={pendingChat}
                                            setScrollPosition={setScrollPosition}
                                            scrollPosition={scrollPosition}
                                            scrollRef={scrollRef}
                                            setMessageHistoryIndex={setMessageHistoryIndex}
                                            messageHistoryIndex={messageHistoryIndex}
                                            initialIndex={initialIndex}
                                        />
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