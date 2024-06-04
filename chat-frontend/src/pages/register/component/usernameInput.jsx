import { useEffect } from "react";
import { useRegContext } from "../../../context/registerContext";


const UsernameInput = () => {

    const {regUseStateValueObj, regUseStateSetObj} = useRegContext();

    const isUsernameValidFetch = async (username) => {

        const res = await fetch(`api/Auth/UsernameValidator/${username}`)

        if (res.status === 200) {
            return true;
        } else {
            return false;
        }

    }

    const usernameValidator = async (e) => {
        let input = e.target.value;
        if (isUsernameLengthValid(input)) {
            const isUsed = await isUsernameUsed(input);
            if (!isUsed) {
                regUseStateSetObj.setUsernameState(input);
                regUseStateSetObj.setUsernameResultValue(true);
            } else {
                regUseStateSetObj.setUsernameResultValue(false);
            }
        }
    }

    const isUsernameLengthValid = (username) => {
        return username === "" ? regUseStateSetObj.setUsernameResultValue("") :
            username.length < 5 ? regUseStateSetObj.setUsernameResultValue("short") :
                username.length > 12 ? regUseStateSetObj.setUsernameResultValue("large") :
                    true;
    }

    const isUsernameUsed = async (input) => {

        const res = await isUsernameValidFetch(input);

        if (res === true) {
            return false;
        } else {
            return true;
        }
    }


    return (
        <>
            <div className={regUseStateValueObj.UsernameResult === null ? "registrationCheckNull" :
                regUseStateValueObj.UsernameResult === true ? "registrationCheckTrue" :
                    "registrationCheckFalse"
            }>
                <input type="text"
                    onBlur={(e) => usernameValidator(e)}
                    placeholder="Username"
                    className="registrationInput"
                    onChange={(e) => setUsernameState(e.target.value)}
                    defaultValue={regUseStateValueObj.Username !== null ? regUseStateValueObj.Username : ""}
                ></input>
                {
                    regUseStateValueObj.UsernameResult === true ? <span>✔</span> :
                    regUseStateValueObj.UsernameResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>
            <div id="usernameInfobox">
                {
                    regUseStateValueObj.UsernameResult === null ? <span>Please select username!</span> :
                    regUseStateValueObj.UsernameResult === true ? <span>Valid Username</span> :
                    regUseStateValueObj.UsernameResult === "large" ? <span>Too long username, max size 12 char.</span> :
                    regUseStateValueObj.UsernameResult === "short" ? <span>Too short username, min size 5 char.</span> :
                    regUseStateValueObj.UsernameResult === "" ? <span>Please select username!</span> :
                    regUseStateValueObj.UsernameInfoBox !== null ? <span>{regUseStateValueObj.UsernameInfoBox}</span> :
                                            <span>The username is already in use!</span>
                }

            </div>
        </>
    )
}

export default UsernameInput;