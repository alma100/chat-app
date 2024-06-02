import { useActiveChatDataContex } from "../../../../context/activeChatDataContext";
import { useChatDataContex } from "../../../../context/chatContext";
import Submit from "../../../../icons/submit.png"

const ActiveChatInput = () => {

    const {useStateValueObject, useStateSetObject} = useChatDataContex();

    const {value, sendJsonMessage} = useActiveChatDataContex();

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
            sendJsonMessage(input);
        }

        saveOrUpdateMessages(chatId, "");
    }

    const saveOrUpdateMessages = (chatId, message) => {

        const updatedMessages = { ...useStateValueObject.messageInput };

        updatedMessages[chatId] = message;
        useStateSetObject.setMessageInput(updatedMessages);
    }


    return (
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
    )
}

export default ActiveChatInput;