import { useState } from "react";
import { useNavigate } from "react-router-dom"



const Login = ({ setProfileData }) => {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [result, setResult] = useState(null);


    const loginRequestFetch = (loginData) => {
        return fetch('/api/Auth/login', {
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
                setResult(null);
            } else {
                setResult("error");
            }
        });
    }



    const loginClickHandler = (e) => {
        console.log(e.target.textContent)
        e.target.textContent === "Back" ? navigate("/") :
            e.target.textContent === "Login" ? loginRequestHandler() :
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
        console.log(data)
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
        <>
            <div onClick={(e) => loginClickHandler(e)}>
                Back
            </div>
            Login
            <div id="loginResult">
                {result === false ? <>Wrong Email/Username or password</> :
                    result === null ? <>Email/Username or password missing.</> :
                        result === "error" ? <>Server error, try it again few secound later.</> : <></>}
            </div>
            <div>
                <div>
                    Username or Email:
                </div>
                <input type="text" onChange={(e) => { emailHandler(e); }}></input>
            </div>
            <div>
                <div>
                    Password:
                </div>

                <input type="password"
                    onChange={(e) => { passwordHandler(e) }}
                    onKeyDown={(e) => { handleKeyPress(e) }}>
                </input>
            </div>

            <div>
                <button onClick={(e) => loginClickHandler(e)}>Login</button>  or <button onClick={(e) => loginClickHandler(e)}>SingIn</button>
            </div>

            <div>
                Forget your password? Request new one here.
            </div>
        </>

    )
}

export default Login;
