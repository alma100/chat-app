import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Eye from "../../icons/eye.png"
import Hide from "../../icons/hide.png"
import "./login.css"
import { useUserDataContext } from "../../context/userDataContext";


const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [result, setResult] = useState(null);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const { setProfileData } = useUserDataContext();

    
    const loginRequestFetch = (loginData) => {
        return fetch('/api/Auth/Login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        }).then(res => {
            if (res.status === 200) {
                setResult(true);
                return res.json();
            } else if (res.status === 401) {
                setResult(false);
            } else if (res.status === 400) {
                setResult("");
            } else {
                setResult("error");
            }
        });
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const loginClickHandler = (e) => {
        e.target.textContent === "Back" ? navigate("/") :
            e.target.textContent === "Log In" ? loginRequestHandler() :
                navigate("/registration");
    }

    const emailHandler = (input) => {
        setEmail(input.target.value);
    };

    const passwordHandler = (input) => {
        setPassword(input.target.value);
    };

    const loginRequestHandler = () => {
        const data = {
            name: email,
            password: password
        };

        loginRequestFetch(data).then(
            res => {
                if (res !== undefined) {
                    setProfileData(res);
                    navigate("/chat")
                }
            }
        )
       

    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            loginRequestHandler();
        }
    }


    return (
        <div id="loginRoot">
            <div id="loginContainer">

                <h2>
                    Log into
                </h2>
                <div id="loginResult">
                    {result === false ? <>Wrong Email/Username or password</> :
                        result === "" ? <>Email/Username or password missing.</> :
                            result === "error" ? <>Server error, try it again few secound later.</> : <></>}
                </div>
                <div className="loginInput">
                    <input
                        className="registrationInput"
                        type="text"
                        onChange={(e) => { emailHandler(e); }}
                        placeholder="Username or Email">
                    </input>
                </div>
                <div id="loginPassContainer">
                    <div className="loginInput">
                        <input
                            placeholder="Password"
                            type={passwordVisible ? "text" : "password"}
                            className="registrationInput"
                            onChange={(e) => { passwordHandler(e) }}
                            onKeyDown={(e) => { handleKeyPress(e) }}>
                        </input>
                        {password && (
                            <span onClick={togglePasswordVisibility}>
                                {passwordVisible ? (
                                    <img className="loginShowIcon" src={Hide} alt="Hide password Icon" />
                                ) : (
                                    <img className="loginShowIcon" src={Eye} alt="Show password Icon" />
                                )}
                            </span>
                        )}
                    </div>

                </div>

                <div>
                    <button onClick={(e) => loginClickHandler(e)}>Log In</button>
                </div>

                <div id="loginExtraOptions">
                    <div>
                        Forget account?
                    </div>
                    <div>
                        -
                    </div>
                    <div onClick={(e) => loginClickHandler(e)}>
                        Sign Up to ...
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Login;
