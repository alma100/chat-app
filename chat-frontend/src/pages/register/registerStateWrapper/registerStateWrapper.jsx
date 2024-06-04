import { useState } from "react";
import { RegContext } from "../../../context/registerContext";
import Registration from "../page/register";

const RegisterStateWrapper = () => {

    const [RegistrationResult, setRegistrationResult] = useState(null);
    const [ServerErrorMessage, setServerErrorMessage] = useState(null);

    const [Username, setUsername] = useState(null);
    const [UsernameResult, setUsernameResult] = useState(null);
    const [UsernameInfoBox, setUsernameInfoBox] = useState(null);

    const [Email, setEmail] = useState(null);
    const [EmailResult, setEmailResult] = useState(null);
    const [EmailInfoBox, setEmailInfoBox] = useState(null);

    const [Password, setPassword] = useState(null);
    const [PasswordResult, setPasswordResult] = useState(null);
    const [PasswordInfoBox, setPasswordInfoBox] = useState(null);

    const [PasswordConfirm, setPasswordConfirm] = useState(null);
    const [PasswordConfirmValue, setPasswordConfirmValue] = useState(null);

    const [PasswordVisible, setPasswordVisible] = useState(false);
    const [PasswordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    const [Firstname, setFirstname] = useState(null);
    const [FirstnameResult, setFirstnameResult] = useState(null);

    const [Lastname, setLastname] = useState(null);
    const [LastnameResult, setLastnameResult] = useState(null);

    const regUseStateValueObj = {
        RegistrationResult, ServerErrorMessage, Username, UsernameResult, UsernameInfoBox, Email, EmailResult, EmailInfoBox,
        Password, PasswordResult, PasswordInfoBox, PasswordConfirm, PasswordConfirmValue, PasswordVisible, PasswordConfirmVisible,
        Firstname, FirstnameResult, Lastname, LastnameResult
    }

    const regUseStateSetObj = {
        setRegistrationResult, setServerErrorMessage, setUsername, setUsernameResult, setUsernameInfoBox, setEmail, setEmailResult,
        setEmailInfoBox, setPassword, setPasswordResult, setPasswordInfoBox, setPasswordConfirm, setPasswordConfirmValue, setPasswordVisible,
        setPasswordConfirmVisible, setFirstname, setFirstnameResult, setLastname, setLastnameResult
    }

    return (
       <RegContext.Provider value={{regUseStateValueObj, regUseStateSetObj}}>
            <Registration />
       </RegContext.Provider>
    )
}

export default RegisterStateWrapper;