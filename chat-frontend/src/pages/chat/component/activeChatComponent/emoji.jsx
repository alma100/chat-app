
import "../../emoji.css"
import { useChatDataContex } from "../../../../context/chatContext";
import { useActiveChatDataContex } from "../../../../context/activeChatDataContext";

const Emoji = ({ chatId, messageId}) => {

    const {useStateValueObject} = useChatDataContex();

    const {sendJsonMessage} =useActiveChatDataContex();

    function includesLabel(emojiList, label) {
        return emojiList.some(emojiObj => emojiObj.EmojiName === label);
    }

    const emojiPicker = (value, chatId, messageId) => {
        
        let currentMessage = useStateValueObject.messageHistory[chatId].find(m => m.MessageId === messageId);

        let input = {};

        let message = {
            MessageId: messageId,
            UserId: useStateValueObject.profileData.id,
            Content: currentMessage.Content,
            Emoji: [],
            ChatId: chatId,
        };


        if (includesLabel(currentMessage.Emoji, value.label)) {
            currentMessage.Emoji = currentMessage.Emoji.filter(emoji => emoji.EmojiName !== value.label);

            message.Emoji = currentMessage.Emoji;
          
            console.log("remove emoji");

            input = {
                Event: "remove emoji",
                UserId: useStateValueObject.profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }

        } else {

            let emojiObj = {
                EmojiName: value.label,
                UserId: useStateValueObject.profileData.id,
                MessageId: messageId
            }

            currentMessage.Emoji.push(emojiObj);

            message.Emoji = currentMessage.Emoji;

            input = {
                Event: "add emoji",
                UserId: useStateValueObject.profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }
        }

        sendJsonMessage(input);
    }


    return (
        <>
            <div className="emojiContextContainer">
                {
                    useStateValueObject.REACTIONS.map((value, index) => {
                        return <span onClick={() => { emojiPicker(value, chatId, messageId) }} key={`emojiContextElem${index}`}>
                            {value.emoji}
                        </span>
                    })
                }
            </div>
        </>
    )
}

export default Emoji;