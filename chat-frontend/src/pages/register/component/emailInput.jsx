import { useRegContext } from "../../../context/registerContext";

const EmailInput = () => {

    const {regUseStateValueObj, regUseStateSetObj} = useRegContext();


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
                    regUseStateSetObj.setEmailResult(true);
                    regUseStateSetObj.setEmail(input);
                } else {
                    regUseStateSetObj.setEmailResult(false);
                }

            } else {
                regUseStateSetObj.setEmailResult("charNotValid");
            }

        } else {
            regUseStateSetObj.setEmailResult("")
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
            <div className={regUseStateValueObj.EmailResult === null ? "registrationCheckNull" :
                regUseStateValueObj.EmailResult === true ? "registrationCheckTrue" :
                    "registrationCheckFalse"
            }>
                <input type="text" onBlur={(e) => emailValidator(e)}
                    placeholder="Email"
                    className="registrationInput"
                    defaultValue={regUseStateValueObj.Email !== null ? regUseStateValueObj.Email : ""}>
                </input>
                {
                    regUseStateValueObj.EmailResult === true ? <span>✔</span> :
                    regUseStateValueObj.EmailResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>
            <div id="emailInfobox">
                {
                    regUseStateValueObj.EmailResult === null ? <span>Please select email!</span> :
                    regUseStateValueObj.EmailResult === true ? <span>Valid email</span> :
                    regUseStateValueObj.EmailResult === "charNotValid" ? <span>Invalid email format!</span> :
                    regUseStateValueObj.EmailResult === "" ? <span>Please select email!</span> :
                    regUseStateValueObj.EmailInfoBox !== null ? <span>{EmailInfoBox}</span> :
                                        <span>The email is already in use!</span>
                }

            </div>
        </>
    )
}

export default EmailInput;