import { useActivChatDataContex } from "../../../context/activeChatContext";
import Close from "../../../icons/close.png"

const PendingChat = ({chatId, index, messageBackToOnline}) => {

    const {useStateValueObject, useStateSetObject} = useActivChatDataContex()

    const chatMessageWarningHandler = (chatId, index) => {
        useStateSetObject.setShowCloseIcon(index);
    }

    const closeMessageInTab = (chatId, e) => {
        e.stopPropagation();  //prevent to trigger the parrent div onClick action.
        let upgradedPedingChat = useStateValueObject.pendingChat.filter(id => id !== chatId);
        useStateSetObject.setPendingChat(upgradedPedingChat);
        useStateSetObject.setShowCloseIcon(null);
    }


    return (
        <>
            <div className="pending-chat-container" style={{ bottom: `calc(10px + ${index * 90}px)` }}
                onClick={() => messageBackToOnline(chatId)}
                onMouseEnter={() => chatMessageWarningHandler(chatId, index)}
                onMouseLeave={() => useStateSetObject.setShowCloseIcon(null)}
                key={`pendigChat${index}`}>

                <div id={`closeTabChat${index}`}
                    style={{
                        position: 'relative',
                        bottom: '5px',
                        left: '40px',
                        displey: 'flex',
                        justifyContent: 'center',
                        visibility: useStateValueObject.showCloseIcon === index ? 'visible' : 'hidden',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'rgb(224, 222, 222)',
                        alignItems: 'center',
                        borderRadius: '50px',
                    }}
                    onClick={(e) => { closeMessageInTab(chatId, e) }}>
                    <img style={{
                        width: '13px',
                        height: '13px',
                    }} src={Close} alt="Close chat tab Icon" />
                </div>
                {chatId}
            </div>
            <div id={`messageTabChat${index}`}
            key={`messageTabChat${index}`}
                style={{
                    position: 'absolute',
                    bottom: `calc(15px + ${index * 90}px)`,
                    right: '110px',
                    displey: 'flex',
                    visibility: useStateValueObject.showCloseIcon === index ? 'visible' : 'hidden',
                    width: '200px',
                    height: '50px',
                    backgroundColor: 'rgb(224, 222, 222)',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: '5px'
                }}>
                Last message content...
            </div>
        </>
    )
}

export default PendingChat;