
import User from "../../../icons/user.png"
import Happiness from "../../../icons/happiness.png"
import Emoji from "./activeChatComponent/emoji";
import DisplayEmoji from "./activeChatComponent/displayEmoji";
import ActiveChatHeader from "./activeChatComponent/activeChatHeader";
import { useActiveChatDataContex } from "../../../context/activeChatDataContext";
import { useChatDataContex } from "../../../context/chatContext";
import ActiveChatInput from "./activeChatComponent/activeChatInputField";

const ActiveChat = () => {

    const {useStateValueObject, useStateSetObject} = useChatDataContex()

    const {value, index} = useActiveChatDataContex();
    

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

            <ActiveChatHeader />

            <div className="chat-box-body">
                <div className="chat-box-overlay"
                    id={index}
                    ref={useStateValueObject.scrollRef}
                    onScroll={(e) => handleScroll(e, value)}
                    >
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
                                                                return <DisplayEmoji emojiValue={value}/>
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
                                        onMouseEnter={() => { useStateSetObject.setOnFocusMessage(message.MessageId) }}
                                        onMouseLeave={() => { useStateSetObject.setOnFocusMessage(null), useStateSetObject.setClickEmojiPicker(null) }}>
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
                                                                    return <DisplayEmoji emojiValue={value}/>
                                                                }
                                                            })
                                                        }
                                                    </div>

                                                </div>


                                                <div className="addEmoji"
                                                    style={{
                                                        visibility: useStateValueObject.onFocusMessage === message.MessageId ? 'visible' : 'hidden',
                                                    }}
                                                    onClick={() => { emojiClickHandler(message.MessageId) }}>
                                                    {
                                                        useStateValueObject.clickEmojiPicker === message.MessageId ? (

                                                            <Emoji  chatId={message.ChatId} messageId={message.MessageId}/>

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
            
            <ActiveChatInput />
                   
        </div>
    )
}

export default ActiveChat;