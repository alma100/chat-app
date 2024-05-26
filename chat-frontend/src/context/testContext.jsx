import { createContext, useContext } from "react";

export const TestContext = createContext(null);

export const useTestContext = () => {  //custom hook to get context hook data
    const context = useContext(TestContext);
    if (!context) {
      throw new Error("useUserDataContext must be used within a UserDataContextProvider");
    }
    return context;
};