import Eye from "../../icons/eye.png"
import Hide from "../../icons/hide.png"

const PasswordInput = ({PasswordResult, Password, passwordVisible, PasswordInfoBox,
    setPasswordResult, setPassword, setPasswordConfirm, PasswordConfirmValue,
    setPasswordVisible,
}) => {

    const passwordValidator = (input) => {
        let localPassRes = 0;
        if (isPasswordLengthValid(input)) {

            if (isPasswordValidChars(input)) {
                localPassRes++;
                setPasswordResult(true);
                

            } else {
                setPasswordResult("notValidChar");
                
            }
        }
        setPassword(input);

        if (input !== PasswordConfirmValue) {
            setPasswordConfirm(false);
        } else if (input === PasswordConfirmValue && localPassRes === 1) {
            setPasswordConfirm(true);
        }
        localPassRes = 0;
    }

    const isPasswordLengthValid = (password) => {
        if (password === null) {
            return false;
        }
        if (password === "") {
            setPasswordResult("");
            return false;
        } else if (password.length < 2) {  //for demo
            setPasswordResult("short");
            return false;
        } else if (password.length > 30) {
            setPasswordResult("long");
            return false;
        } else {
            return true;
        }
    }

    const isPasswordValidChars = (password) => {

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

        if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
            return true;
        }
        return false;
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <div className="registrationPasswordContainer">
                <div className={PasswordResult === null ? "registrationCheckNull" :
                    PasswordResult === true ? "registrationCheckTrue" :
                        "registrationCheckFalse"
                }>
                    <input type={passwordVisible ? "text" : "password"}
                        placeholder="New password"
                        onChange={(e) => passwordValidator(e.target.value)}
                        onBlur={(e) => { passwordValidator(e.target.value) }}
                        className="registrationInput"
                        defaultValue={Password !== null ? Password : ""}>
                    </input>

                    {
                        PasswordResult === true ? <span>✔</span> :
                            PasswordResult === null ? <span></span> :
                                <span>❗</span>
                    }

                    {
                        Password && (
                            <span onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <img className="showIcon" src={Hide} alt="Hide password Icon" /> :
                                    <img className="showIcon" src={Eye} alt="Show password Icon" />}
                            </span>
                        )
                    }

                </div>

            </div>

            <div id="registerPasswordInfoBox">
                {PasswordInfoBox !== null ? <span>{PasswordInfoBox}</span> : <></>}
            </div>
        </>
    )
}

export default PasswordInput;