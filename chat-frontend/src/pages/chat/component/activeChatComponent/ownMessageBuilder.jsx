import { useChatDataContex } from "../../../../context/chatContext"
import DisplayEmoji from "./displayEmoji";

const OwenMessageBuiler = ({message, index}) => {

    const {useStateSetObject} = useChatDataContex()


    return (
        <div className="chatOwnMessageWrapper"
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
                                    return <DisplayEmoji emojiValue={value} />
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
    )
}

export default OwenMessageBuiler;