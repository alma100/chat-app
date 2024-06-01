import { useChatDataContex } from "../../../context/chatContext";


const DisplayAllChat = ({messageBackToOnline}) => {
    const {useStateValueObject, useStateSetObject} = useChatDataContex();

    const chatHandler = (chatDto) => {
        console.log(chatDto.id);
        if (!(chatDto.id in useStateValueObject.messageHistory)) {

            useStateSetObject.setMessageHistory({
                ...useStateValueObject.messageHistory,
                [chatDto.id]: []
            }); //ha mégnem kapott üzenetet DONE ,  + létrehozni és lekérni a régi üzeneteket.!!!
        }

        if (!useStateValueObject.activeChat.includes(chatDto.id) && !useStateValueObject.pendingChat.includes(chatDto.id)) {
            messageBackToOnline(chatDto.id);
            creatDefaultMessHistoryValue(chatDto.id)

        } else if (!useStateValueObject.activeChat.includes(chatDto.id) && useStateValueObject.pendingChat.includes(chatDto.id)) {
            const updatedPendingList = useStateValueObject.pendingChat.filter(number => number !== chatDto.id);
            useStateSetObject.setPendingChat(updatedPendingList)
            messageBackToOnline(chatDto.id);
        }

    }

    const creatDefaultMessHistoryValue = (currentIndex) => {

        console.log("default index creat")

        let updatedSplitedMessage = { ...useStateValueObject.messageHistoryIndex };

        if (!(currentIndex in useStateValueObject.messageHistoryIndex)) {

            updatedSplitedMessage[currentIndex] = useStateValueObject.initialIndex
            console.log(updatedSplitedMessage[currentIndex])
            useStateSetObject.setMessageHistoryIndex(updatedSplitedMessage)

        }
    }




   

    return (
        <>
            <div id="allChatContainer">
                <div>Chats</div>
                {
                    useStateValueObject.allChatData && useStateValueObject.allChatData.map((value, index) => {
                        return <div className="allChatContentDiv"
                            onClick={() => { chatHandler(value) }} key={`allChat${index}`}>{value.usersFullName[0]}</div>
                    })
                }
            </div>
        </>
    )
}


export default DisplayAllChat;