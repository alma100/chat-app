import { createContext, useContext } from "react";


export const RegContext = createContext();

export const useRegContext = () => {
    const context = useContext(RegContext);

    if(!context) {
        throw new Error("useRegContext must be used within a RegContextProvider");
    }

    return context;
}