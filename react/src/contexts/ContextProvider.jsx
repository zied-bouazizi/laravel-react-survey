import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    questionTypes: [],
    setCurrentUser: () => {},
    setUserToken: () => {}
})

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '')
    const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"])

    const setUserToken = (token) => {
        if(token) {
            localStorage.setItem('TOKEN', token)
        } else {
            localStorage.removeItem('TOKEN')
        }
        _setUserToken(token)
    }

    return (
        <StateContext.Provider value={{
            currentUser,
            userToken,
            setCurrentUser,
            setUserToken,
            questionTypes
        }}>
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)