
import { useRegContext } from "../../../context/registerContext"
import Eye from "../../../icons/eye.png"
import Hide from "../../../icons/hide.png"

const PasswordInput = () => {

    const {regUseStateValueObj, regUseStateSetObj} = useRegContext();

    const passwordValidator = (input) => {
        let localPassRes = 0;
        if (isPasswordLengthValid(input)) {

            if (isPasswordValidChars(input)) {
                localPassRes++;
                regUseStateSetObj.setPasswordResult(true);
            } else {
                regUseStateSetObj.setPasswordResult(false);
            }
        }
        regUseStateSetObj.setPassword(input);

        if (input !== regUseStateValueObj.PasswordConfirmValue) {
            regUseStateSetObj.setPasswordConfirm(false);
        } else if (input === regUseStateValueObj.PasswordConfirmValue && localPassRes === 1) {
            regUseStateSetObj.setPasswordConfirm(true);
        }
        localPassRes = 0;
    }

    const isPasswordLengthValid = (password) => {
        if (password === null) {
            return false;
        }
        if (password === "") {
            regUseStateSetObj.setPasswordResult(false);
            return false;
        } else if (password.length < 2) {  //for demo
            regUseStateSetObj.setPasswordResult(false);
            return false;
        } else if (password.length > 30) {
            regUseStateSetObj.setPasswordResult(false);
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
        regUseStateSetObj.setPasswordVisible(!regUseStateValueObj.PasswordVisible);
    };

    return (
        <>
            <div className="registrationPasswordContainer">
                <div className={regUseStateValueObj.PasswordResult === null ? "registrationCheckNull" :
                    regUseStateValueObj.PasswordResult === true ? "registrationCheckTrue" :
                        "registrationCheckFalse"
                }>
                    <input type={regUseStateValueObj.PasswordVisible ? "text" : "password"}
                        placeholder="New password"
                        onChange={(e) => passwordValidator(e.target.value)}
                        onBlur={(e) => { passwordValidator(e.target.value) }}
                        className="registrationInput"
                        defaultValue={regUseStateValueObj.Password !== null ? regUseStateValueObj.Password : ""}>
                    </input>
                    {
                        regUseStateValueObj.PasswordResult === true ? <span>✔</span> :
                        regUseStateValueObj.PasswordResult === null ? <span></span> :
                                <span>❗</span>
                    }

                    {
                        regUseStateValueObj.Password && (
                            <span onClick={togglePasswordVisibility}
                            >
                                {regUseStateValueObj.PasswordVisible ? <img className="showIcon" src={Hide} alt="Hide password Icon" /> :
                                    <img className="showIcon" src={Eye} alt="Show password Icon" />}
                            </span>
                        )
                    }

                </div>

                <div id="regPassInputContainer" style={{
                    visibility: regUseStateValueObj.PasswordResult === false ? 'visible' : 'hidden',
                }}>
                    <div id="regPassInputWrapper" style={{
                        visibility: regUseStateValueObj.PasswordResult === false ? 'visible' : 'hidden',
                    }}>
                        Password must be minimum 6 charcter long and contains special, number, uppercase and lowercase character.
                        <div id="passInputTriangle" sstyle={{
                            visibility: regUseStateValueObj.PasswordResult === false ? 'visible' : 'hidden',
                        }}>

                        </div>
                    </div>
                </div>

            </div>

            <div id="registerPasswordInfoBox">
                {regUseStateValueObj.PasswordInfoBox !== null ? <span>{regUseStateValueObj.PasswordInfoBox}</span> : <></>}
            </div>
        </>
    )
}

export default PasswordInput;