

const NameInput = ({FirstnameResult, Firstname, LastnameResult, Lastname,
    setFirstnameResult, setFirstname, setLastnameResult, setLastname
}) => {

    const isFirstnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                setFirstname(input.trim());
                setFirstnameResult(true);
            } else {
                setFirstnameResult(false);
            }

        } else {
            setFirstname(null);
            setFirstnameResult("");
        }
    }

    const isLastnameValid = (e) => {
        const input = e.target.value;

        if (input !== "") {
            const pattern = /\d/;
            if (!pattern.test(input)) {
                setLastname(input.trim());
                setLastnameResult(true);
            } else {
                setLastnameResult(false);
            }
        } else {
            setLastname(null);
            setLastnameResult("");
        }

    }

    return (
        <div id="registrationNameContainer">
            <div className={FirstnameResult === null ? "registrationCheckNameNull" :
                FirstnameResult === true ? "registrationCheckNameTrue" :
                    "registrationCheckNameFalse"
            }>
                <input
                    type="text"
                    placeholder="First name"
                    onBlur={(e) => isFirstnameValid(e)}
                    className="registrationNameInput"
                    defaultValue={Firstname !== null ? Firstname : ""}>

                </input>
                {
                    FirstnameResult === true ? <span>✔</span> :
                        FirstnameResult === null ? <></> :
                            <>❗</>
                }
            </div>
            <div className={LastnameResult === null ? "registrationCheckNameNull" :
                LastnameResult === true ? "registrationCheckNameTrue" :
                    "registrationCheckNameFalse"
            }>
                <input
                    type="text"
                    placeholder="Last name"
                    className="registrationNameInput"
                    onBlur={(e) => isLastnameValid(e)}
                    defaultValue={Lastname !== null ? Lastname : ""}>
                </input>
                {
                    LastnameResult === true ? <span>✔</span> :
                        LastnameResult === null ? <span></span> :
                            <span>❗</span>
                }
            </div>

        </div>
    )
}

export default NameInput;