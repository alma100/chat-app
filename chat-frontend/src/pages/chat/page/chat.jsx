import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../../Navbar/navbar";
import { Box, Grid } from "@mui/material";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "../chat.css"
import ActiveChat from "../component/activeChat";
import { useChatDataContex } from "../../../context/chatContext";
import SearchBarComponent from "../component/searchBarComponent";
import DisplayAllChat from "../component/displayAllChatComponent";
import PendingChat from "../component/pendingChatComponent";
import { ActiveChatDataContex } from "../../../context/activeChatDataContext";


const Chat = () => {

    const navigate = useNavigate();

    const { useStateValueObject, useStateSetObject } = useChatDataContex()

    const WS_URL = "ws://localhost:5102/ws";


    const { lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('WebSocket connection closed'),
        share: true,

        shouldReconnect: (closeEvent) => true,
        withCredentials: true,
    });

    useEffect(() => {
        if (useStateValueObject.profileData !== null) {
            let message = {
                Event: "connection request",
                UserId: useStateValueObject.profileData.id,
                Content: null,
                ChatId: null
            };
            if (readyState === ReadyState.OPEN) {
                console.log("lekéri az összes chatet.")
                sendJsonMessage(message);
                getAllChatFetch().then(res => {
                    useStateSetObject.setAllChatData(res);
                });

                //handlePrevMessage();
            }
        }
    }, [useStateValueObject.profileData, readyState])


    useEffect(() => {
        if (useStateValueObject.profileData === null) {
            refreshProfilData().then(res => {
                if (res !== undefined) {
                    useStateSetObject.setProfileData(res);
                }
            });
        }
    }, [useStateValueObject.profileData])


    useEffect(() => {
        if (lastMessage !== null) {
            const messageObject = JSON.parse(lastMessage.data);
            console.log(messageObject);
            if (messageObject.Event !== "connection request") {
                handleIncomingMessage(messageObject.Message, messageObject.Event);
                incrementMessageHistoryIndex(messageObject.Message.ChatId);
                if (useStateValueObject.activeChat.length !== 0) {
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
        if (useStateValueObject.activeChat.length > 0 || (useStateValueObject.activeChat.length === 0 && useStateValueObject.bottomRefe !== 0)) {
            handleBottomReference();
        }
    }, [useStateValueObject.activeChat])

    const incrementMessageHistoryIndex = (chatId) => {
        let updatedSplitedMessage = { ...useStateValueObject.messageHistoryIndex };

        if (chatId in useStateValueObject.messageHistoryIndex && useStateValueObject.messageHistoryIndex[chatId] !== 0) {
            let newIndex = updatedSplitedMessage[chatId] + 1;

            updatedSplitedMessage[chatId] = newIndex;
            useStateSetObject.setMessageHistoryIndex(updatedSplitedMessage);
        }
    }



    const isScrolledChat = (currentChatId) => {

        let isScrolled = useStateValueObject.scrollPosition.filter(obj => obj.chatId === currentChatId);

        if (isScrolled.length === 0 || isScrolled[0].position === true) {
            return true;
        }

        return false;
    }

    const scrollBottom = (currentChatId) => {
        setTimeout(() => {

            let index = -1;

            useStateValueObject.activeChat.forEach((id, i) => {
                if (id === currentChatId) {
                    index = i
                }
            })

            useStateValueObject.bottomRefe[index].scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    const handleBottomReference = () => {

        if (useStateValueObject.bottomRefe.length < useStateValueObject.activeChat.length) {


            let currentChatId = useStateValueObject.activeChat[useStateValueObject.activeChat.length - 1]

            useStateSetObject.setScrollRef([...useStateValueObject.scrollRefe, useStateValueObject.scrollRef.current])
            useStateSetObject.setBottomRef([...useStateValueObject.bottomRefe, useStateValueObject.bottomRef.current]);

            if (isScrolledChat(currentChatId)) {
                useStateValueObject.bottomRef.current.scrollIntoView();
            } else {
                let index = -1;

                useStateValueObject.scrollPosition.forEach((obj, i) => {
                    if (obj.chatId === currentChatId) {
                        index = i
                    }
                })

                useStateValueObject.scrollRef.current.scrollTop = useStateValueObject.scrollPosition[index].position;
            }

        } else if (useStateValueObject.bottomRefe.length > useStateValueObject.activeChat.length) {
            let upgradeBottomRef = useStateValueObject.bottomRefe.slice(0, -1);
            let upgradeScrollRef = useStateValueObject.scrollRefe.slice(0, -1);
            useStateSetObject.setScrollRef(upgradeScrollRef);
            useStateSetObject.setBottomRef(upgradeBottomRef);

            useStateValueObject.activeChat.forEach((chatId, slotIndex) => {

                let isScrolled = false;
                let index = 0
                useStateValueObject.scrollPosition.forEach((scrollObj, i) => {
                    if (chatId === scrollObj.chatId) {
                        isScrolled = true;
                        index = i
                    }
                })

                if (isScrolled && useStateValueObject.scrollPosition[index].position !== true) {
                    upgradeScrollRef[slotIndex].scrollTop = useStateValueObject.scrollPosition[index].position;
                } else {
                    upgradeBottomRef[slotIndex].scrollIntoView();
                }

            })

        } else {
            useStateValueObject.activeChat.forEach((chatId, slotIndex) => {
                let isScrolled = false;
                let index = 0
                useStateValueObject.scrollPosition.forEach((scrollObj, i) => {
                    if (chatId === scrollObj.chatId) {
                        isScrolled = true;
                        index = i
                    }
                })


                if (isScrolled && useStateValueObject.scrollPosition[index].position !== true) {
                    useStateValueObject.scrollRefe[slotIndex].scrollTop = scrollPosition[index].position;
                } else {
                    useStateValueObject.bottomRefe[slotIndex].scrollIntoView();
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

        const updatedMessageHistory = { ...useStateValueObject.messageHistory };

        let message = updatedMessageHistory[messageObj.ChatId].map(m => {
            if (m.MessageId === messageObj.MessageId) {
                return messageObj;
            }
            else {
                return m;
            }
        });
        updatedMessageHistory[messageObj.ChatId] = message;
        useStateSetObject.setMessageHistory(updatedMessageHistory);
    }

    function messageIsExist(messageList, messageId) {
        return messageList.some(messageObj => messageObj.MessageId === messageId);
    }

    const handleIncomingMessageEvent = (messageObj) => {
        if (messageObj.ChatId in useStateValueObject.messageHistory) {
            if (!messageIsExist(useStateValueObject.messageHistory[messageObj.ChatId], messageObj.MessageId)) {
                console.log("incomingIf")
                useStateSetObject.setMessageHistory({
                    ...useStateValueObject.messageHistory,
                    [messageObj.ChatId]: [...useStateValueObject.messageHistory[messageObj.ChatId], messageObj]
                });
            }

        } else {
            console.log("incomingElse")
            useStateSetObject.setMessageHistory({
                ...useStateValueObject.messageHistory,
                [messageObj.ChatId]: [messageObj]
            });
            getAllChatFetch().then(res => {
                setAllChatData(res);
            })
        }
    }


    const getCurrentChatMessage = async (chatid, nextIndex) => {
        const res = await fetch(`/ws/Message/GetChatMessage/${chatid}/${nextIndex}`);

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

    const getAllChatFetch = () => {
        return fetch("/api/Chat/GetAllChat").then(res => res.json())
    }


    //-------------- onlineChat methods --------------

    const messageBackToOnline = async (chatId) => {
        let currentActiveChat = [...useStateValueObject.activeChat];
        let upgradedPedingChat = useStateValueObject.pendingChat.filter(id => id !== chatId);

        let messageInChat = "";
        if (useStateValueObject.messageHistory[chatId] === undefined) {
            let updatedMessageHistory = { ...useStateValueObject.messageHistory };

            messageInChat = await getCurrentChatMessage(chatId, 0);

            updatedMessageHistory[chatId] = messageInChat[chatId];

            useStateSetObject.setMessageHistory(
                updatedMessageHistory
            )
        }

        if (currentActiveChat.length >= 3) {
            let firstChatId = currentActiveChat[0];
            let newOnlineChat = currentActiveChat.slice(1);
            newOnlineChat.push(chatId);
            useStateSetObject.setActiveChat(newOnlineChat);

            upgradedPedingChat.push(firstChatId)

        } else {

            useStateSetObject.setActiveChat([...currentActiveChat, chatId])

        }

        useStateSetObject.setPendingChat(upgradedPedingChat);
        useStateSetObject.setShowCloseIcon(null);
    }


    return (
        <>
            {
                useStateValueObject.profileData !== null ? (
                    <div>
                        <Navbar />
                        <Box className="chatBox">
                            <Grid container width="100%">
                                <Grid item xs={5} ms={5} md={3} >
                                    <div className="chatGrid">
                                        <SearchBarComponent />
                                    </div>

                                </Grid>
                                <Grid item xs={0} ms={0} md={7}>

                                </Grid>
                                <Grid item xs={5} ms={5} md={2}>
                                    <div className="chatGrid">

                                        <DisplayAllChat messageBackToOnline={messageBackToOnline} />
                                    </div>

                                </Grid>
                            </Grid>
                        </Box>
                        <div id="chatboxRoot">

                            {
                                useStateValueObject.pendingChat.map((chatId, index) => {
                                    return <PendingChat chatId={chatId} index={index} messageBackToOnline={messageBackToOnline} />

                                })
                            }

                            {
                                useStateValueObject.activeChat.map((value, index) => {
                                    if (index < 3) {
                                        return <ActiveChatDataContex.Provider value={{value, index, sendJsonMessage}}>
                                            <ActiveChat />
                                        </ActiveChatDataContex.Provider>
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