import Minus from "../../icons/minus.png"
import Close from "../../icons/close.png"
import User from "../../icons/user.png"
import Happiness from "../../icons/happiness.png"
import Submit from "../../icons/submit.png"


import Emoji from "./emoji";
import DisplayEmoji from "./displayEmoji";

const ActiveChat = ({ index, value, allChatData, messageHistory, setOnFocusMessage, REACTIONS, setClickEmojiPicker,
    onFocusMessage, clickEmojiPicker, bottomRef, messageInput, setMessageInput, activeChat, setActiveChat,
    sendMessage, profileData, setPendingChat, setMessageHistory, sendJsonMessage, pendingChat, setScrollPosition,
    scrollPosition, scrollRef

}) => {

    const closeChatBox = (id) => {
        const updatedList = activeChat.filter(number => number !== id);
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

    const sendMessageToTab = (chatId) => {
        closeChatBox(chatId);
        setPendingChat([...pendingChat, chatId]);
    }

    const saveOrUpdateMessages = (chatId, message) => {

        const updatedMessages = { ...messageInput };

        updatedMessages[chatId] = message;
        setMessageInput(updatedMessages);
    }

    const emojiClickHandler = (messageId) => {

        setClickEmojiPicker(messageId);

    }


    

    const handleScroll = (event, chatId) => {

        const { scrollTop, scrollHeight, clientHeight } = event.target;

        let currentPosition = true;

        if (scrollTop + clientHeight >= scrollHeight) {
            currentPosition = true;  
        } else {
            currentPosition = event.target.scrollTop
        }

        const Obj = {
            chatId: chatId,
            position: currentPosition
        }

        const upgradedScrollPosition = [...scrollPosition];

        let chatIdInScrollPosition = upgradedScrollPosition.filter(obj => obj.chatId !== chatId);

        if(chatIdInScrollPosition.length !== scrollPosition){
            setScrollPosition([...chatIdInScrollPosition, Obj])
        }else{
            setScrollPosition([...upgradedScrollPosition, Obj])
        }
        //setScrollPosition(event.target.scrollTop);
        //console.log(event.target.scrollTop)

        

    };

    return (
        <div className="chat-box" style={{ left: `calc(60vw - ${index * 350}px)` }} key={index}>
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
                    <span onClick={() => { sendMessageToTab(value) }}  //fv
                        className="chat-box-toggle-element">
                        <img className="onlineChatMinusIcon" src={Minus} alt="Close chat tab Icon" />
                    </span>
                    <span onClick={() => { closeChatBox(value) }}  //fv
                        className="chat-box-toggle-element">
                        <img className="onlineChatCloseIcon" src={Close} alt="Close chat tab Icon" />
                    </span>
                </div>
            </div>
            <div className="chat-box-body">
                <div className="chat-box-overlay"
                    id={index}
                    ref={scrollRef}
                    onScroll={(e)=>handleScroll(e, value)}>
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
                    <div id={`${index}`} ref={bottomRef} />
                </div>

            </div>
            <div className="chat-input">
                <div className="onlie-Chat-Input-Container">
                    <input
                        onChange={(e) => { saveOrUpdateMessages(value, e.target.value) }}
                        className="chat-input-field"
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
    )
}

export default ActiveChat;