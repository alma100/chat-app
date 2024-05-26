import { createContext, useContext } from "react";

export const UserDataContext = createContext(null);

export const useUserDataContext = () => {  //custom hook to get context hook data
    const context = useContext(UserDataContext);
    if (!context) {
      throw new Error("useUserDataContext must be used within a UserDataContextProvider");
    }
    return context;
};