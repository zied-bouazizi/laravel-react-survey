import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    questionTypes: [],
    toast: {
        message: null,
        show: false,
    },
    setCurrentUser: () => {},
    setUserToken: () => {}
})

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '')
    const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"])
    const [toast, setToast] = useState({
        message: '',
        show: false
    })

    const setUserToken = (token) => {
        if(token) {
            localStorage.setItem('TOKEN', token)
        } else {
            localStorage.removeItem('TOKEN')
        }
        _setUserToken(token)
    }

    const showToast = (message) => {
        setToast({
            message,
            show: true
        });
        setTimeout(() => {
            setToast({
                message: '',
                show: false
            });
        }, 5000);
    }

    return (
        <StateContext.Provider value={{
            currentUser,
            userToken,
            setCurrentUser,
            setUserToken,
            questionTypes,
            toast,
            showToast
        }}>
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)