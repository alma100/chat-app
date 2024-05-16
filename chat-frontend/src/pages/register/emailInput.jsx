const EmailInput = ({EmailResult, Email, EmailInfoBox, setEmailResult, setEmail}) => {

    const isEmailValidFetch = async (email) => {

        const res = await fetch(`api/Auth/EmailValidator/${email}`)

        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    }

    const emailValidator = async (e) => {
        let input = e.target.value;

        if (isEmailLengthValid(input)) {
            if (isEmailCharValid(input)) {

                const res = await isEmailUsed(input);

                if (!res) {
                    setEmailResult(true);
                    setEmail(input);
                } else {
                    setEmailResult(false);
                }

            } else {
                setEmailResult("charNotValid");
            }

        } else {
            setEmailResult("")
        }

    }

    const isEmailLengthValid = (email) => {
        return email === "" ? false : true;
    }

    const isEmailCharValid = (input) => {  //react email validator --> npm install react-email-validator

        const firstChar = input.charAt(0);
        const lastChar = input.charAt(input.length - 1);

        if (/^[a-zA-Z]$/.test(firstChar) && /^[a-z]$/.test(lastChar)) {
            if (/[@]/.test(input)) {

                const betweenAtAndDot = input.substring(input.indexOf('@') + 1);

                if (/^[a-z]+\.[a-z]+$/.test(betweenAtAndDot)) {
                    return true;

                }
            }

        }

        return false;

    }

    const isEmailUsed = async (input) => {

        const result = await isEmailValidFetch(input);

        if (result === true) {
            return false;
        } else {
            return true;
        }

    }

    return (
        <>
            <div className={EmailResult === null ? "registrationCheckNull" :
                EmailResult === true ? "registrationCheckTrue" :
                    "registrationCheckFalse"
            }>
                <input type="text" onBlur={(e) => emailValidator(e)}
                    placeholder="Email"
                    className="registrationInput"
                    defaultValue={Email !== null ? Email : ""}>
                </input>
                {
                    EmailResult === true ? <span>✔</span> :
                        EmailResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>
            <div id="emailInfobox">
                {
                    EmailResult === null ? <span>Please select email!</span> :
                        EmailResult === true ? <span>Valid email</span> :
                            EmailResult === "charNotValid" ? <span>Invalid email format!</span> :
                                EmailResult === "" ? <span>Please select email!</span> :
                                    EmailInfoBox !== null ? <span>{EmailInfoBox}</span> :
                                        <span>The email is already in use!</span>
                }

            </div>
        </>
    )
}

export default EmailInput;