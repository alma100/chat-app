
import { useNavigate } from "react-router-dom";
import { Box, Grid, useScrollTrigger } from "@mui/material";
import "../register.css";
import NameInput from "../component/nameInput";
import UsernameInput from "../component/usernameInput";
import EmailInput from "../component/emailInput";
import PasswordInput from "../component/registrationPasswordInput";
import PasswordConfirmInput from "../component/regPassConfirmInput";
import SuccessRegistration from "../component/successfulRegistration";
import UnSuccessfullReg from "../component/unSuccessfullReg";
import RegistrationProcessBar from "../component/registrationProcessbar";
import { useRegContext } from "../../../context/registerContext";




const Registration = () => {

    const { regUseStateValueObj, regUseStateSetObj } = useRegContext()

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
            "email": regUseStateValueObj.Email,
            "username": regUseStateValueObj.Username,
            "password": regUseStateValueObj.Password,
            "role": "user",
            "firstName": regUseStateValueObj.Firstname,
            "lastName": regUseStateValueObj.Lastname
        }

        const res = await registrationFetch(data);

        if (res.status === 201) {
            regUseStateSetObj.setRegistrationResult(true);
        } else {
            regUseStateSetObj.setRegistrationResult(false);
            const responseBody = await res.text();
            regUseStateSetObj.setServerErrorMessage(JSON.parse(responseBody));
        }
    }

    const serverErrorHandler = () => {

        regUseStateSetObj.setRegistrationResult(null);
        regUseStateSetObj.setPasswordConfirmValue(null);
        regUseStateSetObj.setPasswordConfirm(null);

        for (let key in serverErrorMessage) {
            if (key.includes("Password")) {
                regUseStateSetObj.setPassword(null);
                regUseStateSetObj.setPasswordResult(false);
                regUseStateSetObj.setPasswordInfoBox(serverErrorMessage[key]);
            } else if (key.includes("Email")) {
                regUseStateSetObj.setEmail(null);
                regUseStateSetObj.setEmailResult(false);
                regUseStateSetObj.setEmailInfoBox(serverErrorMessage[key]);
            } else if (key.includes("User")) {
                regUseStateSetObj.setUsernameState(null);
                regUseStateSetObj.setUsernameResultValue(false);
                regUseStateSetObj.setInfoBoxValue(serverErrorMessage[key]);
            }
        }
    }

    return (
        <>
            {
                regUseStateValueObj.RegistrationResult === null ? (
                    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
                        <Grid container spacing={2}>
                            <Grid item xs={4}>

                            </Grid>
                            <Grid item xs={4}>
                                <div id="registerContainer">
                                    <div id="regContextContainer">
                                        <RegistrationProcessBar />
                                        <div id="registrationBox">
                                            <h2>Sign Up</h2>
                                        </div>
                                        <NameInput />

                                        <div id="registrationUserDataContainer">
                                            <UsernameInput />

                                            <EmailInput />

                                            <PasswordInput />

                                            <PasswordConfirmInput />

                                            {
                                                regUseStateValueObj.PasswordResult === true && regUseStateValueObj.EmailResult === true && regUseStateValueObj.UsernameResult === true &&
                                                    regUseStateValueObj.PasswordConfirm === true && regUseStateValueObj.FirstnameResult === true && regUseStateValueObj.LastnameResult === true ?
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
                    regUseStateValueObj.RegistrationResult === true ? (
                        <SuccessRegistration />
                    ) : (
                        <UnSuccessfullReg serverErrorHandler={serverErrorHandler}/>
                    )
            }

        </>

    )
}

export default Registration;