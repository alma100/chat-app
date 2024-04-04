import { useNavigate } from "react-router-dom"


const Login = () => {
    
    const navigate = useNavigate();

    const loginClickHandler = (e) => {
        console.log(e.target.textContent)
        e.target.textContent === "Back" ? navigate("/") :
        e.target.textContent === "Login" ? navigate("/chat") :
        navigate("/registration");
    }

    return (
        <>
        <div onClick={(e)=> loginClickHandler(e)}>
            Back
        </div>
            Login

            <div>
                <div>
                    Username or Email:
                </div>
                <input type="text"></input>
            </div>
            <div>
                <div>
                Password:
                </div>
                
                <input type="text"></input>
            </div>

            <div>
                <button onClick={(e)=> loginClickHandler(e)}>Login</button>  or <button onClick={(e)=> loginClickHandler(e)}>SingIn</button>
            </div>

            <div>
                Forget your password? Request new one here.
            </div>
        </>

    )
}

export default Login;
