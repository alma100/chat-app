import Eye from "../../icons/eye.png"
import Hide from "../../icons/hide.png"

const PasswordConfirm = ({PasswordConfirm, passwordConfirmVisible, PasswordConfirmValue, PasswordResult,
    setPasswordConfirm, setPasswordConfirmValue, setPasswordConfirmVisible, Password
}) => {

    const passwordCheck = () => {

        if (Password === PasswordConfirmValue && PasswordResult) {
            setPasswordConfirm(true);
        } else {
            setPasswordConfirm(false);
        }

    }

    const saveConfirmPass = (e) => {
        let input = e.target.value;
        console.log(input)
        if (input === Password) {
            setPasswordConfirm(true);
            setPasswordConfirmValue(input);
        } else {
            setPasswordConfirm(false);
            setPasswordConfirmValue(input);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
    };

    

    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmVisible(!passwordConfirmVisible);
    };

    return (
        <>
            <div className="registrationPasswordContainer">
                <div className={PasswordConfirm === null ? "registrationCheckNull" :
                    PasswordConfirm === "ok" ? "registrationCheckTrue" :
                        PasswordConfirm === true ? "registrationCheckTrue" :
                            "registrationCheckFalse"
                }>
                    <input type={passwordConfirmVisible ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => saveConfirmPass(e)} onPaste={handlePaste}
                        onBlur={() => { passwordCheck() }}
                        className="registrationInput">
                    </input>

                    {
                        PasswordConfirmValue && (
                            <span onClick={togglePasswordConfirmVisibility}
                            >
                                {passwordConfirmVisible ? <img className="showIcon" src={Hide} alt="Hide password Icon" /> :
                                    <img className="showIcon" src={Eye} alt="Show password Icon" />}
                            </span>
                        )
                    }

                </div>

            </div>

            <div id="passwordConfirmInfobox">
                {
                    PasswordResult === false ? <span>Passwords not match!</span> : <></>
                }
            </div>
        </>
    )
}

export default PasswordConfirm;