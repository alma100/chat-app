import Minus from "../../../icons/minus.png"
import Close from "../../../icons/close.png"
import User from "../../../icons/user.png"
import Happiness from "../../../icons/happiness.png"
import Submit from "../../../icons/submit.png"
import { useEffect, useState, useRef } from "react";

import Emoji from "./emoji";
import DisplayEmoji from "./displayEmoji";
import { useActivChatDataContex } from "../../../context/activeChatContext"

const ActiveChat = ({value, index, sendMessage}) => {

    const {useStateValueObject, useStateSetObject} =useActivChatDataContex()

    const closeChatBox = (id) => {
        const updatedList = useStateValueObject.activeChat.filter(number => number !== id);
        useStateSetObject.setActiveChat(updatedList);

        const updatedSplitedMessage = { ...useStateValueObject.messageHistoryIndex }
        delete updatedSplitedMessage[id];
        useStateSetObject.setMessageHistoryIndex(updatedSplitedMessage);

        const updateScrollPosition = useStateValueObject.scrollPosition.filter(obj => obj.chatId !== id);
        useStateSetObject.setScrollPosition(updateScrollPosition)

    }

    const sendButtonHandler = (chatId) => {

        if (useStateValueObject.messageInput[chatId] !== "") {
            let message = {
                UserId: useStateValueObject.profileData.id,
                Content: useStateValueObject.messageInput[chatId],
                Emoji: [],
                ChatId: chatId,
            };

            let input = {
                Event: "message",
                UserId: useStateValueObject.profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }
            sendMessage(JSON.stringify(input));
        }

        saveOrUpdateMessages(chatId, "");
    }

    const sendMessageToTab = (chatId) => {
        const updatedList = useStateValueObject.activeChat.filter(number => number !== chatId);
        useStateSetObject.setActiveChat(updatedList);
        useStateSetObject.setPendingChat([...useStateValueObject.pendingChat, chatId]);
    }

    const saveOrUpdateMessages = (chatId, message) => {

        const updatedMessages = { ...useStateValueObject.messageInput };

        updatedMessages[chatId] = message;
        useStateSetObject.setMessageInput(updatedMessages);
    }

    const emojiClickHandler = (messageId) => {

        useStateSetObject.setClickEmojiPicker(messageId);

    }

    const splitMessageHistory = async (currentIndex) => {

        let updatedSplitedMessage = { ...useStateValueObject.messageHistoryIndex };

        if (currentIndex in useStateValueObject.messageHistoryIndex) {

            if (updatedSplitedMessage[currentIndex] < useStateValueObject.messageHistory[currentIndex].length) {
                let newIndex = updatedSplitedMessage[currentIndex] + useStateValueObject.initialIndex;

                updatedSplitedMessage[currentIndex] = newIndex;
                useStateSetObject.setMessageHistoryIndex(updatedSplitedMessage);

            }

            if (useStateValueObject.messageHistoryIndex[value] === useStateValueObject.messageHistory[value].length) {
                
                await handlePrevMessage(value);
            }

        }

    }

    const handlePrevMessage = async (chatId) => {
        let nextIndex = 0;
    
        if (useStateValueObject.messageHistory[chatId] !== undefined) {
            let messageInChat = "";

            nextIndex = useStateValueObject.messageHistory[chatId].length;
            let updatedMessageHistory = { ...useStateValueObject.messageHistory };

            messageInChat = await getCurrentChatMessage(chatId, nextIndex);

            let oldList = updatedMessageHistory[chatId]
           
            let newList = messageInChat[chatId].concat(oldList)
            
            updatedMessageHistory[chatId] = newList;

            useStateSetObject.setMessageHistory(
                updatedMessageHistory
            )
            
            let res = messageInChat[chatId].length > 0 ? true : false;
            
            return res
        }
    
        return false;
    }


    const handleScroll = async (event, chatId) => {

        let histPosition = 0;
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        let currentPosition = true;

        if (scrollTop + clientHeight >= scrollHeight) {
            currentPosition = true;
        } else {
            currentPosition = event.target.scrollTop
            histPosition = event.target.scrollTop
            if (currentPosition === 0) {

                await splitMessageHistory(chatId);

                if (currentPosition === 0) event.target.scrollTop = 10;

            }

        }

        const Obj = {
            chatId: chatId,
            position: currentPosition
        }

        const upgradedScrollPosition = [...useStateValueObject.scrollPosition];

        let chatIdInScrollPosition = upgradedScrollPosition.filter(obj => obj.chatId !== chatId);

        if (chatIdInScrollPosition.length !== useStateValueObject.scrollPosition) {

            useStateSetObject.setScrollPosition([...chatIdInScrollPosition, Obj])
        } else {

            useStateSetObject.setScrollPosition([...upgradedScrollPosition, Obj])
        }

    };

    return (
        <div className="chat-box" style={{ left: `calc(60vw - ${index * 350}px)` }} key={index}>
            <div className="chat-box-header">
                <div className="chat-box-header-elements">
                    {
                        useStateValueObject.allChatData.map(obj => {
                            if (obj.id == value) {
                                return obj.usersFullName[0];
                            }
                        })
                    }
                </div>
                <div className="chat-box-toggle">
                    <span onClick={() => { sendMessageToTab(value) }}  //fv
                        className="chat-box-toggle-element">
                        <img className="onlineChatMinusIcon" src={Minus} alt="Send  tab Icon" />
                    </span>
                    <span onClick={() => { closeChatBox(value) }}  //fv
                        className="chat-box-toggle-element">
                        <img className="onlineChatCloseIcon" src={Close} alt="Close chat Icon" />
                    </span>
                </div>
            </div>
            <div className="chat-box-body">
                <div className="chat-box-overlay"
                    id={index}
                    ref={useStateValueObject.scrollRef}
                    onScroll={(e) => handleScroll(e, value)}>
                    {
                        useStateValueObject.messageHistory[value].map((message, index) => {
                            if (index > useStateValueObject.messageHistory[value].length - (1 + useStateValueObject.messageHistoryIndex[value])) {
                                if (message.UserId === useStateValueObject.profileData.id) {
                                    return <div className="chatOwnMessageWrapper"
                                        id={message.ChatId + "." + index}
                                        onMouseEnter={() => { useStateSetObject.setOnFocusMessage(message.MessageId) }}
                                        onMouseLeave={() => { useStateSetObject.setOnFocusMessage(null) }}>
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
                                        onMouseEnter={() => { setOnFocusMessage(message.MessageId) }}
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

                                                            <Emoji />

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
                            }
                            

                        }) 
                    }
                    <div id={`${index}`} ref={useStateValueObject.bottomRef} />
                </div>

            </div>
            <div className="chat-input">
                <div className="onlie-Chat-Input-Container">
                    <input
                        onChange={(e) => { saveOrUpdateMessages(value, e.target.value) }}
                        className="chat-input-field"
                        value={useStateValueObject.messageInput[value] === undefined ? "" : useStateValueObject.messageInput[value]}
                    >
                    </input>
                    <div onClick={() => sendButtonHandler(value)}
                        className="online-chat-send-Button-div">
                        <img className="online-chat-icon" src={Submit} alt="Show password Icon" />
                    </div>
                </div>


            </div>

        </div>
    )
}

export default ActiveChat;