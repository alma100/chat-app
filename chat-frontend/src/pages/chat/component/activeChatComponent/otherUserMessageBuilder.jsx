import User from "../../../../icons/user.png"
import Happiness from "../../../../icons/happiness.png"
import Emoji from "./emoji";
import DisplayEmoji from "./displayEmoji";
import { useChatDataContex } from "../../../../context/chatContext";



const OtherUserMessageBuilder = ({message, index}) => {

    const {useStateValueObject, useStateSetObject} = useChatDataContex();

    const emojiClickHandler = (messageId) => {

        useStateSetObject.setClickEmojiPicker(messageId);

    }

    return (
        <div className="chatMessageWrapper"
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
                                        return <DisplayEmoji emojiValue={value} />
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

                                <Emoji chatId={message.ChatId} messageId={message.MessageId} />

                            ) : (
                                <></>
                            )
                        }

                        <img className="addEmojiIcon" src={Happiness} alt="chat add emoji Icon" />

                    </div>

                </div>


            </div>

        </div>
    )
}


export default OtherUserMessageBuilder;