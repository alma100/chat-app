import { useRegContext } from "../../../context/registerContext";


const NameInput = () => {

    const {regUseStateValueObj, regUseStateSetObj} = useRegContext()

    const isFirstnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                regUseStateSetObj.setFirstname(input.trim());
                regUseStateSetObj.setFirstnameResult(true);
            } else {
                regUseStateSetObj.setFirstnameResult(false);
            }

        } else {
            regUseStateSetObj.setFirstname(null);
            regUseStateSetObj.setFirstnameResult("");
        }
    }

    const isLastnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                regUseStateSetObj.setLastname(input.trim());
                regUseStateSetObj.setLastnameResult(true);
            } else {
                regUseStateSetObj.setLastnameResult(false);
            }
        } else {
            regUseStateSetObj.setLastname(null);
            regUseStateSetObj.setLastnameResult("");
        }

    }

    return (
        <div id="registrationNameContainer">
            <div className={regUseStateValueObj.FirstnameResult === null ? "registrationCheckNameNull" :
                regUseStateValueObj.FirstnameResult === true ? "registrationCheckNameTrue" :
                    "registrationCheckNameFalse"
            }>
                <input
                    type="text"
                    placeholder="First name"
                    onBlur={(e) => isFirstnameValid(e)}
                    className="registrationNameInput"
                    defaultValue={regUseStateValueObj.Firstname !== null ? regUseStateValueObj.Firstname : ""}>

                </input>
                {
                    regUseStateValueObj.FirstnameResult === true ? <span>✔</span> :
                    regUseStateValueObj.FirstnameResult === null ? <></> :
                            <>❗</>
                }
            </div>
            <div className={regUseStateValueObj.LastnameResult === null ? "registrationCheckNameNull" :
                regUseStateValueObj.LastnameResult === true ? "registrationCheckNameTrue" :
                    "registrationCheckNameFalse"
            }>
                <input
                    type="text"
                    placeholder="Last name"
                    className="registrationNameInput"
                    onBlur={(e) => isLastnameValid(e)}
                    defaultValue={regUseStateValueObj.Lastname !== null ? regUseStateValueObj.Lastname : ""}>
                </input>
                {
                    regUseStateValueObj.LastnameResult === true ? <span>✔</span> :
                    regUseStateValueObj.LastnameResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>

        </div>
    )
}

export default NameInput;