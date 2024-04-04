import { useNavigate } from "react-router-dom";

const Main = () => {

    const navigate = useNavigate();

    const authHandler = (e) => {
       e.target.textContent === "Login" ? navigate("/login") : navigate("/registration")
        
        
    }

    return(
        <>
            Asd
            <div>
                <button onClick={(e)=> authHandler(e)}>Login</button>
                <button onClick={(e)=> authHandler(e)}>Singin</button>
            </div>
            
        </>
    )
}

export default Main;