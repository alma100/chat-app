import { useEffect, useState } from "react"

const useSingIn = () => {
    const [Username, setUsername] = useState(null);
    const [UsernameResult, setUsernameResult] = useState(null);
    const [UsernameInfoBox, setUsernameInfoBox] = useState(null);

    useEffect(()=> {
        
        console.log(UsernameResult)
    },[UsernameResult])

    const setUsernameState = (usernameValue) => {
        setUsername(usernameValue);
    }

    const setUsernameResultValue = (usernameResultValue) => {
        console.log(usernameResultValue)
        setUsernameResult(usernameResultValue);
    }

    const setInfoBoxValue = (infoBoxValue) => {
        setUsernameInfoBox(infoBoxValue);
    }


    return {Username, setUsernameState, UsernameResult, setUsernameResultValue, UsernameInfoBox, setInfoBoxValue}
}

export default useSingIn;