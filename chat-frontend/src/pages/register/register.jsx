import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import "./register.css";
import Eye from "../../icons/eye.png"
import Hide from "../../icons/hide.png"



const Registration = () => {

    const [registrationResult, setRegistrationResult] = useState(null);
    const [serverErrorMessage, setServerErrorMessage] = useState(null);

    const [Username, setUsername] = useState(null);
    const [UsernameResult, setUsernameResult] = useState(null);
    const [UsernameInfoBox, setUsernameInfoBox] = useState(null);

    const [Email, setEmail] = useState(null);
    const [EmailResult, setEmailResult] = useState(null);
    const [EmailInfoBox, setEmailInfoBox] = useState(null);

    const [Password, setPassword] = useState(null);
    const [PasswordResult, setPasswordResult] = useState(null);
    const [PasswordInfoBox, setPasswordInfoBox] = useState(null);

    const [PasswordConfirm, setPasswordConfirm] = useState(null);
    const [PasswordConfirmValue, setPasswordConfirmValue] = useState(null);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    const [Firstname, setFirstname] = useState(null);
    const [FirstnameResult, setFirstnameResult] = useState(null);

    const [Lastname, setLastname] = useState(null);
    const [LastnameResult, setLastnameResult] = useState(null);

    const navigate = useNavigate();

    const isUsernameValidFetch = async (username) => {

        const res = await fetch(`api/Auth/UsernameValidator/${username}`)

        if (res.status === 200) {
            return true;
        } else {
            return false;
        }

    }

    const registrationFetch = async (data) => {

        const res = await fetch('api/Auth/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return res;

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
            console.log('asd')
            setPasswordConfirm(false);
        } else if (input === PasswordConfirmValue && localPassRes === 1) {
            setPasswordConfirm(true);
            console.log('asd1')
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

    const passwordCheck = () => {

        if (Password === PasswordConfirmValue && PasswordResult) {
            setPasswordConfirm(true);
        } else {
            setPasswordConfirm(false);
        }
        console.log(Password, PasswordConfirmValue)


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

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmVisible(!passwordConfirmVisible);
    };


    const isFirstnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                setFirstname(input.trim());
                setFirstnameResult(true);
            } else {
                setFirstnameResult(false);
            }

        } else {
            setFirstname(null);
            setFirstnameResult("");
        }
    }

    const isLastnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                setLastname(input.trim());
                setLastnameResult(true);
            } else {
                setLastnameResult(false);
            }
        } else {
            setLastname(null);
            setLastnameResult("");
        }

    }


    const registrationHandler = async () => {

        const data = {
            "email": Email,
            "username": Username,
            "password": Password,
            "role": "user",
            "firstName": Firstname,
            "lastName": Lastname
        }

        const res = await registrationFetch(data);

        if (res.status === 201) {
            setRegistrationResult(true);
        } else {
            setRegistrationResult(false);
            const responseBody = await res.text();
            console.log(JSON.parse(responseBody))
            setServerErrorMessage(JSON.parse(responseBody));
        }
    }

    const serverErrorHandler = () => {

        setRegistrationResult(null);
        setPasswordConfirmValue(null);
        setPasswordConfirm(null);

        for (let key in serverErrorMessage) {
            if (key.includes("Password")) {
                setPassword(null);
                setPasswordResult(false);
                setPasswordInfoBox(serverErrorMessage[key]);
            } else if (key.includes("Email")) {
                setEmail(null);
                setEmailResult(false);
                setEmailInfoBox(serverErrorMessage[key]);
            } else if (key.includes("User")) {
                setUsername(null);
                setUsernameResult(false);
                setUsernameInfoBox(serverErrorMessage[key]);
            }
        }
    }

    return (
        <>
            {
                registrationResult === null ? (
                    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
                        <Grid container spacing={2}>
                            <Grid item xs={4}>

                            </Grid>
                            <Grid item xs={4}>

                                <div id="registerContainer">


                                    <div id="regContextContainer">
                                        <div id="registrationBox">
                                            <h2>Registration</h2>
                                        </div>
                                        <div id="registrationNameContainer">
                                            <div className={FirstnameResult === null ? "registrationCheckNameNull" :
                                                FirstnameResult === true ? "registrationCheckNameTrue" :
                                                    "registrationCheckNameFalse"
                                            }>
                                                <input
                                                    type="text"
                                                    placeholder="First name"
                                                    onBlur={(e) => isFirstnameValid(e)}
                                                    className="registrationNameInput"
                                                    defaultValue={Firstname !== null ? Firstname : ""}>

                                                </input>
                                                {
                                                    FirstnameResult === true ? <span>✔</span> :
                                                        FirstnameResult === null ? <></> :
                                                            <>❗</>
                                                }
                                            </div>
                                            <div className={LastnameResult === null ? "registrationCheckNameNull" :
                                                LastnameResult === true ? "registrationCheckNameTrue" :
                                                    "registrationCheckNameFalse"
                                            }>
                                                <input
                                                    type="text"
                                                    placeholder="Last name"
                                                    className="registrationNameInput"
                                                    onBlur={(e) => isLastnameValid(e)}
                                                    defaultValue={Lastname !== null ? Lastname : ""}>
                                                </input>
                                                {
                                                    LastnameResult === true ? <span>✔</span> :
                                                        LastnameResult === null ? <span></span> :
                                                            <span>❗</span>
                                                }
                                            </div>

                                        </div>
                                        <div id="registrationUserDataContainer">
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

                                            {
                                                PasswordResult === true && EmailResult === true && UsernameResult === true && PasswordConfirm === true ?
                                                    (
                                                        <div>
                                                            <button onClick={() => registrationHandler()}>Submit</button>
                                                        </div>
                                                    ) : (
                                                        <div>Already registered? Log in <span onClick={() => navigate("/login")}>here</span>.</div>

                                                    )
                                            }
                                        </div>

                                    </div>
                                </div>

                            </Grid>
                            <Grid item xs={4}>

                            </Grid>
                        </Grid>
                    </Box>

                ) :
                    registrationResult === true ? (
                        <>
                            Succesfull registration! Redirected log in page...
                            or
                            Log in <div onClick={() => { navigate("/login") }}>HERE.</div>
                        </>
                    ) : (
                        <>
                            <div id="regResContainer">
                                <h2>
                                    UnSuccesfull registration!
                                </h2>
                                <h4>
                                    Error(s):
                                </h4>
                                {serverErrorMessage &&
                                    Object.entries(serverErrorMessage).map(([key, value], index) => (
                                        <div key={index}>
                                            <strong>{key}:</strong>
                                            {value.map((errorMessage, subIndex) => (
                                                <div key={subIndex}>
                                                    {errorMessage}
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                }
                            </div>

                            <div><span onClick={() => { serverErrorHandler() }}>Back to the registration</span> or <span>home page</span>.</div>

                        </>
                    )
            }

        </>

    )
}

export default Registration;