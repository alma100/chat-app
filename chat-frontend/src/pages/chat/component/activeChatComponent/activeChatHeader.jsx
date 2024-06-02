import Minus from "../../../../icons/minus.png"
import Close from "../../../../icons/close.png"
import { useChatDataContex } from "../../../../context/chatContext"
import { useActiveChatDataContex } from "../../../../context/activeChatDataContext";

const ActiveChatHeader = () => {

    const {useStateValueObject, useStateSetObject} = useChatDataContex();

    const {value} = useActiveChatDataContex();

    const closeChatBox = (id) => {
        const updatedList = useStateValueObject.activeChat.filter(number => number !== id);
        useStateSetObject.setActiveChat(updatedList);

        const updatedSplitedMessage = { ...useStateValueObject.messageHistoryIndex }
        delete updatedSplitedMessage[id];
        useStateSetObject.setMessageHistoryIndex(updatedSplitedMessage);

        const updateScrollPosition = useStateValueObject.scrollPosition.filter(obj => obj.chatId !== id);
        useStateSetObject.setScrollPosition(updateScrollPosition)

    }

    const sendMessageToTab = (chatId) => {
        const updatedList = useStateValueObject.activeChat.filter(number => number !== chatId);
        useStateSetObject.setActiveChat(updatedList);
        useStateSetObject.setPendingChat([...useStateValueObject.pendingChat, chatId]);
    }

    return (
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
                <span onClick={() => { sendMessageToTab(value) }}
                    className="chat-box-toggle-element">
                    <img className="onlineChatMinusIcon" src={Minus} alt="Send  tab Icon" />
                </span>
                <span onClick={() => { closeChatBox(value) }}
                    className="chat-box-toggle-element">
                    <img className="onlineChatCloseIcon" src={Close} alt="Close chat Icon" />
                </span>
            </div>
        </div>
    )
}

export default ActiveChatHeader;