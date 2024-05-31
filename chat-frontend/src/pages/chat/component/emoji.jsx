import { useEffect, useState, useRef } from "react";
import "../emoji.css"

const Emoji = ({ chatId, messageId, messageHistory, setMessageHistory, sendJsonMessage, reactions, profileData }) => {


    function includesLabel(emojiList, label) {
        return emojiList.some(emojiObj => emojiObj.EmojiName === label);
    }

    const emojiPicker = (value, chatId, messageId) => {
        console.log(value.emoji)
        
        let currentMessage = messageHistory[chatId].find(m => m.MessageId === messageId);

        let input = {};

        console.log(messageHistory[chatId])
        console.log(messageId)
        console.log(currentMessage)

        let message = {
            MessageId: messageId,
            UserId: profileData.id,
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
                UserId: profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }

        } else {

            let emojiObj = {
                EmojiName: value.label,
                UserId: profileData.id,
                MessageId: messageId
            }

            currentMessage.Emoji.push(emojiObj);

            message.Emoji = currentMessage.Emoji;

            input = {
                Event: "add emoji",
                UserId: profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }
        }

        console.log(input)
        sendJsonMessage(input);
    }


    return (
        <>
            <div className="emojiContextContainer">
                {
                    reactions.map((value, index) => {
                        return <span onClick={() => { emojiPicker(value, chatId, messageId) }}>
                            {value.emoji}
                        </span>
                    })
                }
            </div>
        </>
    )
}

export default Emoji;