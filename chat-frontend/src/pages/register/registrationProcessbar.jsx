import { useEffect, useState } from "react";
import "./register.css";

const RegistrationProcessBar = ({ PasswordResult, EmailResult, UsernameResult,
    PasswordConfirm, FirstnameResult, LastnameResult }) => {

    const [resultCount, setResultount] = useState(0)

    useEffect(() => {
        calculateProcessPogres()

    }, [PasswordResult, EmailResult, UsernameResult,
        PasswordConfirm, FirstnameResult, LastnameResult])

    const calculateProcessPogres = () => {
        let resultList = [PasswordResult, EmailResult, UsernameResult, PasswordConfirm, FirstnameResult, LastnameResult];
        let localResult = 0
        resultList.forEach(res => {
            if (res === true) {
                localResult += 15;
            }
        })
        localResult == 90 ? setResultount(97) : setResultount(localResult)

    }

    return (
        <div id="registrationProcess" style={{
            width: `calc(2% + ${resultCount}%)`,
            backgroundColor: resultCount === 0 ? 'black' :
                resultCount === 15 ? '#800000' :
                    resultCount === 30 ? 'red' :
                        resultCount === 45 ? 'orange' :
                            resultCount === 60 ? 'yellow' :
                                resultCount === 75 ? '#90EE90' : 'green',
            borderTopLeftRadius: resultCount === 97 ? '11px' : '0',
            borderTopRightRadius: resultCount === 97 ? '11px' : '0'
        }}>
        </div>
    )
}


export default RegistrationProcessBar;