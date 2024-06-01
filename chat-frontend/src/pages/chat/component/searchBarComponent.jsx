import { useChatDataContex } from "../../../context/chatContext";


const SearchBarComponent = () => {

    const {useStateValueObject, useStateSetObject} = useChatDataContex()

    const handleSearchButtonClick = (name) => {

        let chatObj = {
            UsersId: [name.id, useStateValueObject.profileData.id]
        }

        createChatFetch(chatObj).then(
            res => {
                if (res.status !== 400) {
                    useStateSetObject.setMessageHistory({
                        ...useStateValueObject.messageHistory,
                        [res.id]: []
                    });
                    useStateSetObject.setAllChatData([...useStateValueObject.allChatData, res]);
                } else {
                    console.log("chat exist") //TODO list!! :(
                }

            }
        )
    };

    const chatSearchHandler = () => {
        let nameObj = {
            name: useStateValueObject.searchFieldValue
        }
        if (useStateValueObject.searchFieldValue.length > 0) {
            searchFetch(nameObj).then(res => {
                useStateSetObject.setSearchFetchRes(res);
            })
        } else {
            //error handleing
        }

    }

    const searchFetch = async (name) => {
        const res = await fetch("/api/Chat/GetUserByName", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(name),
        });
        return await res.json();
    }

    const createChatFetch = async (data) => {
        const res = await fetch("/api/Chat/CreatChat", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await res.json();
    }

    


    return (
        <>
            <div id="searchBarContainer">
                <input type="text"
                    onChange={(e) => { useStateSetObject.setSearchFieldValue(e.target.value) }}>
                </input>
                <div id="chatSearchButton"
                    onClick={() => { chatSearchHandler() }}>
                    Search
                </div>
            </div>
            <div id="searchResultContainer">
                {
                    useStateValueObject.searchFetchRes &&
                    Object.values(useStateValueObject.searchFetchRes).map((name, index) => {
                        return <div key={index} onClick={() => handleSearchButtonClick(name)}
                            className="chat-search-result-element">{name.firstName + " " + name.lastName}</div>
                    })
                }
            </div>
        </>
    )
}

export default SearchBarComponent;