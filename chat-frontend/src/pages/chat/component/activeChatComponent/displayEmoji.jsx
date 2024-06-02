import { Tooltip } from "@mui/material";
import { useEffect, useState} from "react";
import { useChatDataContex } from "../../../../context/chatContext";


const DisplayEmoji = ({ emojiValue }) => {

    const {useStateValueObject} = useChatDataContex();

    const [userName, setUserName] = useState(null);

    useEffect(()=>{
       
        showUser(emojiValue)
    },[])

    const getUserFetch = async (userId) => {
        const data = userId;
        const res = await fetch('/api/Chat/getUserById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const responseData = await res.json();
        return responseData;
    }

    const emojiByLabel = (label) => {
        const reaction = useStateValueObject.REACTIONS.find(reaction => reaction.label === label);
        return reaction ? reaction.emoji : null;
    };

    const showUser = async (emojiValue) => {
        let res = await getUserFetch(emojiValue.UserId);
        let usersFullName = res.firstName + " " + res.lastName;
        setUserName(usersFullName);
    }
    
    return (
        <Tooltip title={userName !== null ? userName : "loading..."} placement="top"
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -14],
                            },
                        },
                    ],
                },
            }}>
            <span className="chatEmojiContent">
                {emojiByLabel(emojiValue.EmojiName)}
            </span>
        </Tooltip>

    )
}

export default DisplayEmoji;