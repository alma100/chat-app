import { useNavigate } from "react-router-dom";

const Main = () => {

    const navigate = useNavigate();

    const authHandler = (e) => {
       e.target.textContent === "Log In" ? navigate("/login") : navigate("/registration")
        
        
    }

    return(
        <>
            Asd
            <div>
                <button onClick={(e)=> authHandler(e)}>Log In</button>
                <button onClick={(e)=> authHandler(e)}>Sign Up</button>
            </div>
            
        </>
    )
}

export default Main;