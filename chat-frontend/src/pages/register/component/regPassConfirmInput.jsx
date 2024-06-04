import { useRegContext } from "../../../context/registerContext"
import Eye from "../../../icons/eye.png"
import Hide from "../../../icons/hide.png"

const PasswordConfirm = () => {

    const {regUseStateValueObj, regUseStateSetObj} = useRegContext();


    const passwordCheck = () => {
        if (regUseStateValueObj.Password === regUseStateValueObj.PasswordConfirmValue && regUseStateValueObj.PasswordResult) {
            regUseStateSetObj.setPasswordConfirm(true);
        } else {
            regUseStateSetObj.setPasswordConfirm(false);
        }

    }

    const saveConfirmPass = (e) => {
        let input = e.target.value;
        if (input === Password) {
            regUseStateSetObj.setPasswordConfirm(true);
            regUseStateSetObj.setPasswordConfirmValue(input);
        } else {
            regUseStateSetObj.setPasswordConfirm(false);
            regUseStateSetObj.setPasswordConfirmValue(input);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
    };

    

    const togglePasswordConfirmVisibility = () => {
        regUseStateSetObj.setPasswordConfirmVisible(!regUseStateValueObj.PasswordConfirmVisible);
    };

    return (
        <>
            <div className="registrationPasswordContainer">
                <div className={regUseStateValueObj.PasswordConfirm === null ? "registrationCheckNull" :
                    regUseStateValueObj.PasswordConfirm === "ok" ? "registrationCheckTrue" :
                    regUseStateValueObj.PasswordConfirm === true ? "registrationCheckTrue" :
                            "registrationCheckFalse"
                }>
                    <input type={regUseStateValueObj.PasswordConfirmVisible ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => saveConfirmPass(e)} onPaste={handlePaste}
                        onBlur={() => { passwordCheck() }}
                        className="registrationInput">
                    </input>

                    {
                        regUseStateValueObj.PasswordConfirmValue && (
                            <span onClick={togglePasswordConfirmVisibility}
                            >
                                {regUseStateValueObj.PasswordConfirmVisible ? <img className="showIcon" src={Hide} alt="Hide password Icon" /> :
                                    <img className="showIcon" src={Eye} alt="Show password Icon" />}
                            </span>
                        )
                    }

                </div>

            </div>

            <div id="passwordConfirmInfobox">
                {
                    regUseStateValueObj.PasswordResult === false ? <span>Passwords not match!</span> : <></>
                }
            </div>
        </>
    )
}

export default PasswordConfirm;