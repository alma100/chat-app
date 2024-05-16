import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessRegistration = () => {

    const navigate = useNavigate();

    useEffect(() => {
        NavigateHandler();
    }, [])


    const NavigateHandler = () => {
        setTimeout(() => {
           navigate("/login");
        }, 3000);
    }

    return (
        <div id="succesRegResRoot">
            <div id="regSuccesResContainer">
                Succesfull registration! Redirected log in page...
                or
                Log in <div onClick={() => { navigate("/login") }}>HERE.</div>
            </div>
        </div>

    )
}

export default SuccessRegistration;