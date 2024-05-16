import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import "./register.css";
import NameInput from "./nameInput";
import UsernameInput from "./usernameInput";
import EmailInput from "./emailInput";
import PasswordInput from "./registrationPasswordInput";
import PasswordConfirmInput from "./regPassConfirmInput";
import SuccessRegistration from "./successfulRegistration";
import RegistrationProcessBar from "./registrationProcessbar";



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
                                        <RegistrationProcessBar
                                        PasswordResult={PasswordResult}
                                        EmailResult={EmailResult}
                                        UsernameResult={UsernameResult}
                                        PasswordConfirm={PasswordConfirm}
                                        FirstnameResult={FirstnameResult}
                                        LastnameResult={LastnameResult}
                                        />
                                        <div id="registrationBox">
                                            <h2>Registration</h2>
                                        </div>
                                        <NameInput
                                            FirstnameResult={FirstnameResult}
                                            Firstname={Firstname}
                                            LastnameResult={LastnameResult}
                                            Lastname={Lastname}
                                            setFirstnameResult={setFirstnameResult}
                                            setFirstname={setFirstname}
                                            setLastnameResult={setLastnameResult}
                                            setLastname={setLastname}
                                        />

                                        <div id="registrationUserDataContainer">
                                            <UsernameInput
                                                UsernameResult={UsernameResult}
                                                Username={Username}
                                                setUsernameResult={setUsernameResult}
                                                setUsername={setUsername}
                                                UsernameInfoBox={UsernameInfoBox}
                                            />

                                            <EmailInput
                                                EmailResult={EmailResult}
                                                Email={Email}
                                                EmailInfoBox={EmailInfoBox}
                                                setEmailResult={setEmailResult}
                                                setEmail={setEmail}
                                            />

                                            <PasswordInput
                                                PasswordResult={PasswordResult}
                                                Password={Password}
                                                passwordVisible={passwordVisible}
                                                PasswordInfoBox={PasswordInfoBox}
                                                setPasswordResult={setPasswordResult}
                                                setPassword={setPassword}
                                                setPasswordConfirm={setPasswordConfirm}
                                                PasswordConfirmValue={PasswordConfirmValue}
                                                setPasswordVisible={setPasswordVisible}
                                            />

                                            <PasswordConfirmInput
                                                PasswordConfirm={PasswordConfirm}
                                                passwordConfirmVisible={passwordConfirmVisible}
                                                PasswordConfirmValue={PasswordConfirmValue}
                                                PasswordResult={PasswordResult}
                                                setPasswordConfirm={setPasswordConfirm}
                                                setPasswordConfirmValue={setPasswordConfirmValue}
                                                setPasswordConfirmVisible={setPasswordConfirmVisible}
                                                Password={Password}
                                            />

                                            {
                                                PasswordResult === true && EmailResult === true && UsernameResult === true &&
                                                PasswordConfirm === true && FirstnameResult  === true && LastnameResult === true ?
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
                        <SuccessRegistration />
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