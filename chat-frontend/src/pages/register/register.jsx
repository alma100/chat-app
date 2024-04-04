import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {

    const [Username, setUsername] = useState(null);
    const [UsernameResult, setUsernameResult] = useState(null);

    const [Email, setEmail] = useState(null);
    const [EmailResult, setEmailResult] = useState(null);

    const [Password, setPassword] = useState(null);
    const [PasswordConfirm, setPasswordConfirm] = useState(null);
    const [PasswordResult, setPasswordResult] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    const navigate = useNavigate();

    const isUsernameValidFetch = async (username) => {

        const res = await fetch(`api/Auth/UsernameValidator/${username}`)

        if (res.status === 200) {
            return true;
        } else {
            return false;
        }

    }

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
            setEmailResult(null)
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
        return username === "" ? setUsernameResult(null) :
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

    const passwordValidator = (e) => {

        let input = e.target.value;

        if (isPasswordLengthValid(input)) {
            if (isPasswordValidChars(input)) {
                setPasswordResult("ok");
                setPassword(input);
            } else {
                setPasswordResult("notValidChar");
            }
        }
    }

    const isPasswordLengthValid = (password) => {

        return password === "" ? setPasswordResult(null) :
            password.length < 6 ? setPasswordResult("short") :
                password.length > 30 ? setPasswordResult("long") :
                    true;
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

    const passwordCheck = (e) => {
        console.log(Password)
        console.log(e.target.value)
        if (Password === e.target.value) {
            setPasswordResult(true);
            setPasswordConfirm(e.target.value)
        } else {
            setPasswordResult(false);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault(); // Megállítja a beillesztési eseményt
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmVisible(!passwordConfirmVisible);
    };

    return (
        <div id="registerContainer">

            <div id="registrationBox">
                Registration
            </div>

            <div>
                Username
            </div>
            <div>
                <input type="text"
                    onBlur={(e) => usernameValidator(e)}
                    defaultValue={Username !== null ? Username : ""}
                    onChange={(e) => setUsername(e.target.value)}
                ></input>
            </div>
            <div id="usernameInfobox">
                {
                    UsernameResult === null ? <span>Please select username!</span> :
                        UsernameResult === true ? <span>Valid Username</span> :
                            UsernameResult === "large" ? <span>Too long username, max size 12 char.</span> :
                                UsernameResult === "short" ? <span>Too short username, min size 5 char.</span> :
                                    <span>The username is already in use!</span>
                }

            </div>

            <div>
                Email
            </div>
            <div>
                <input type="text" onBlur={(e) => emailValidator(e)}
                    defaultValue={Email !== null ? Email : ""}></input>
            </div>
            <div id="emailInfobox">
                {
                    EmailResult === null ? <span>Please select email!</span> :
                        EmailResult === true ? <span>Valid email</span> :
                            EmailResult === "charNotValid" ? <span>Invalid email format!</span> :
                                <span>The email is already in use!</span>
                }

            </div>

            <div>
                Password
            </div>
            <div>
                <input type={passwordVisible ? "text" : "password"}
                    onBlur={(e) => passwordValidator(e)}
                    defaultValue={Password !== null ? Password : ""} ></input>
                <button onClick={togglePasswordVisibility}>
                    {passwordVisible ? "Hide" : "Show"}
                </button>
            </div>
            <div id="passwordInfobox">
                {
                    PasswordResult === null ? <span>Please select password!</span> :
                        PasswordResult === "ok" ? <span>Valid password</span> :
                            PasswordResult === "short" ? <span>Too short password, min size 6 char.</span> :
                                PasswordResult === "long" ? <span>Too long password, max size 30 char.</span> :
                                    PasswordResult === "notValidChar" ? <span>Password must contains number spec char and Upper char!</span> :
                                        PasswordResult === true ? <span>Password valid and matched!</span> :
                                            <span>Passwords not match!</span>
                }
            </div>
            <div>
                Password confirmation
            </div>
            <div>
                <input type={passwordConfirmVisible ? "text" : "password"}
                    onChange={(e) => passwordCheck(e)} onPaste={handlePaste}
                    defaultValue={PasswordConfirm !== null ? PasswordConfirm : ""}>
                </input>
                <button onClick={togglePasswordConfirmVisibility}>
                    {passwordConfirmVisible ? "Hide" : "Show"}
                </button>
            </div>
            <div id="passwordInfobox">
                {
                    PasswordResult === false ? <span>Passwords not match!</span> : <></>
                }
            </div>

            {
                PasswordResult === true && EmailResult === true && UsernameResult === true ?
                    (
                        <div>
                            <button onClick={() => navigate("/")}>Back to Home</button>
                            <button onClick={() => navigateHandler()}>Next</button>
                        </div>
                    ) : (
                        <div>Already registered? Log in <span onClick={() => navigate("/login")}>here</span>.</div>
                    )
            }

        </div>
    )
}

export default Registration;