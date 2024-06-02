import { createContext, useContext } from "react";

export const ChatDataContext = createContext(null);

export const useChatDataContex = () =>{
    const context = useContext(ChatDataContext);
    if (!context) {
        throw new Error("useChatDataContex must be used within a ChatDataContexProvider");
      }
      return context;
}

