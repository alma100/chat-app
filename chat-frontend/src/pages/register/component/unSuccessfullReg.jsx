import { useRegContext } from "../../../context/registerContext";


const UnSuccessfullReg = ({ serverErrorHandler }) => {

    const { regUseStateValueObj } = useRegContext()

    return (
        <div id="unSuccessRegResRoot">
            <div id="regResContainer">
                <h2>
                    UnSuccesfull registration!
                </h2>
                <h4>
                    Error(s):
                </h4>
                {
                    regUseStateValueObj.ServerErrorMessage &&
                    Object.entries(regUseStateValueObj.ServerErrorMessage).map(([key, value], index) => (
                        <div key={index}>
                            <strong>{key}:</strong>
                            {value.map((errorMessage, subIndex) => (
                                <div key={subIndex}>
                                    {errorMessage}
                                </div>
                            ))}
                        </div>
                    ))
                }

                
            </div>

            <div><span onClick={() => { serverErrorHandler() }}>Back to the registration</span>.</div>

        </div>
    )
}

export default UnSuccessfullReg;