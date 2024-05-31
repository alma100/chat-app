import { useEffect, useState, useRef } from "react";
import Chat from "../page/chat";
import { ActivChatDataContext } from "../../../context/activeChatContext";
import { useUserDataContext } from "../../../context/userDataContext";

const ChatStateWrapper = () => {

    const {profileData, setProfileData} = useUserDataContext()
    const [searchFieldValue, setSearchFieldValue] = useState(null);
    const [searchFetchRes, setSearchFetchRes] = useState(null);
    const [searchFieldError, setSearchFieldError] = useState(null); //searchField erro handling!!


    const [activeChat, setActiveChat] = useState([]);
    const [pendingChat, setPendingChat] = useState([]);

    //activeChat component
    const [onFocusMessage, setOnFocusMessage] = useState(null);
    const [clickEmojiPicker, setClickEmojiPicker] = useState(null);


    const [allChatData, setAllChatData] = useState([]);

    const [messageInput, setMessageInput] = useState({});
    const [messageHistory, setMessageHistory] = useState({});
    const [messageHistoryIndex, setMessageHistoryIndex] = useState({})


    const [showCloseIcon, setShowCloseIcon] = useState(null);

    const [bottomRefe, setBottomRef] = useState([])
    const [scrollPosition, setScrollPosition] = useState([]);
    const [scrollRefe, setScrollRef] = useState([]);

    const initialIndex = 10;

    const bottomRef = useRef(null);

    const scrollRef = useRef(null);

    const useStateValueObject = {
        searchFieldValue, searchFetchRes, activeChat, pendingChat, onFocusMessage, clickEmojiPicker, allChatData, 
        messageInput, messageHistory, messageHistoryIndex, showCloseIcon, bottomRefe, scrollPosition, scrollRefe, profileData,
        initialIndex, bottomRef, scrollRef
    }

    const useStateSetObject = {
        setSearchFieldValue, setSearchFetchRes, setActiveChat, setPendingChat, setOnFocusMessage, setClickEmojiPicker,
        setAllChatData, setMessageInput, setMessageHistory, setMessageHistoryIndex, setShowCloseIcon, setBottomRef, setScrollPosition,
        setScrollRef, setProfileData
    }

    


    return(
        <ActivChatDataContext.Provider value={{useStateValueObject, useStateSetObject}}>
            <Chat />
        </ActivChatDataContext.Provider>
    )
}


export default ChatStateWrapper;