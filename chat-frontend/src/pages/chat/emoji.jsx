import { useEffect, useState, useRef } from "react";
import "./emoji.css"

const Emoji = ({ chatId, messageId, messageHistory, setMessageHistory, sendJsonMessage, reactions, profileData }) => {


    const emojiPicker = (value, chatId, messageId) => {
        console.log(value.emoji)
        const updatedMessageHistory = { ...messageHistory };

        let currentMessage = messageHistory[chatId][messageId];

        let input = {};

        let message = {
            MessageId: messageId,
            UserId: profileData.id,
            Content: messageHistory[chatId][messageId].Content,
            Emoji: [],
            ChatId: chatId,
        };


        if (currentMessage.Emoji.includes(value.label)) {
            updatedMessageHistory[chatId][messageId].Emoji = updatedMessageHistory[chatId][messageId].Emoji.filter(emoji => emoji !== value.label);

            message.Emoji = updatedMessageHistory[chatId][messageId].Emoji;

            console.log("remove emoji");

            input = {
                Event: "remove emoji",
                UserId: profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }

        } else {
            updatedMessageHistory[chatId][messageId].Emoji.push(value.label);

            message.Emoji = updatedMessageHistory[chatId][messageId].Emoji;

            console.log(value.label)

            console.log(message.Emoji)

            input = {
                Event: "add emoji",
                UserId: profileData.id,
                Content: null,
                Message: message,
                CreatedAt: new Date()
            }
        }

        //setMessageHistory(updatedMessageHistory);
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