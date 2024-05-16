const UsernameInput = ({UsernameResult, Username, setUsernameResult, setUsername, UsernameInfoBox}) => {

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
                setUsername(input);
                setUsernameResult(true);
            } else {
                setUsernameResult(false);
            }
        }
    }

    const isUsernameLengthValid = (username) => {
        return username === "" ? setUsernameResult("") :
            username.length < 5 ? setUsernameResult("short") :
                username.length > 12 ? setUsernameResult("large") :
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
                    onChange={(e) => setUsername(e.target.value)}
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