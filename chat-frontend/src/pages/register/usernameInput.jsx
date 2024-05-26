import { useEffect } from "react";
import useSingIn from "./regHook/useSingIn";
import { useTestContext } from "../../context/testContext";

const UsernameInput = () => {

    const {Username, setUsernameState, UsernameResult, setUsernameResultValue, setInfoBoxValue, UsernameInfoBox} = useTestContext()

    useEffect(()=>{
        console.log("lefut")
        console.log(UsernameResult)
    },[UsernameResult])

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
                setUsernameState(input);
                setUsernameResultValue(true);
            } else {
                setUsernameResultValue(false);
            }
        }
    }

    const isUsernameLengthValid = (username) => {
        return username === "" ? setUsernameResultValue("") :
            username.length < 5 ? setUsernameResultValue("short") :
                username.length > 12 ? setUsernameResultValue("large") :
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
            <div className={UsernameResult === null ? "registrationCheckNull" :
                UsernameResult === true ? "registrationCheckTrue" :
                    "registrationCheckFalse"
            }>
                <input type="text"
                    onBlur={(e) => usernameValidator(e)}
                    placeholder="Username"
                    className="registrationInput"
                    onChange={(e) => setUsernameState(e.target.value)}
                    defaultValue={Username !== null ? Username : ""}
                ></input>
                {
                    UsernameResult === true ? <span>✔</span> :
                        UsernameResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>
            <div id="usernameInfobox">
                {
                    UsernameResult === null ? <span>Please select username!</span> :
                        UsernameResult === true ? <span>Valid Username</span> :
                            UsernameResult === "large" ? <span>Too long username, max size 12 char.</span> :
                                UsernameResult === "short" ? <span>Too short username, min size 5 char.</span> :
                                    UsernameResult === "" ? <span>Please select username!</span> :
                                        UsernameInfoBox !== null ? <span>{UsernameInfoBox}</span> :
                                            <span>The username is already in use!</span>
                }

            </div>
        </>
    )
}

export default UsernameInput;