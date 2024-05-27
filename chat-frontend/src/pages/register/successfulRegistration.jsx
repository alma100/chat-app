import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessRegistration = () => {

    const [time, setTime] = useState(10000)
    const navigate = useNavigate();

   

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 1000) {
                    clearInterval(intervalId);
                    navigate("/login");
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div id="succesRegResRoot">
            <div id="regSuccesResContainer">
                <div>Succesfull registration! Redirected log in page...{time/1000}</div>
                <div class="centered">or</div>
                <div>Click <span class="clickable" onClick={() => { navigate("/login") }}>here.</span></div>
            </div>
        </div>

    )
}

export default SuccessRegistration;