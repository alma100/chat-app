import { createContext, useContext } from "react";

export const ActiveChatDataContex = createContext(null);

export const useActiveChatDataContex = () =>{
    const context = useContext(ActiveChatDataContex);
    if (!context) {
        throw new Error("useActiveChatDataContex must be used within a ActiveChatDataContexProvider");
      }
      return context;
}