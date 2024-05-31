import { createContext, useContext } from "react";

export const ActivChatDataContext = createContext(null);

export const useActivChatDataContex = () =>{
    const context = useContext(ActivChatDataContext);
    if (!context) {
        throw new Error("useActiveChatDataContex must be used within a ActiveChatDataContexProvider");
      }
      return context;
}

