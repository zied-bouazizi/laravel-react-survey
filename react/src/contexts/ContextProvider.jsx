import { createContext, useCallback, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    questionTypes: [],
    toast: {
        message: null,
        show: false,
    },
    setCurrentUser: () => {},
    login: () => {},
    logout: () => {},
})

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || null)
    const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"])
    const [toast, setToast] = useState({
        message: '',
        show: false
    })

    const login = (user, token) => {
        setCurrentUser(user);
        setUserToken(token);
        localStorage.setItem("TOKEN", token);
        localStorage.setItem("auth-login", Date.now());
    };

    const logout = useCallback(() => {
        setCurrentUser({});
        setUserToken(null);
        localStorage.removeItem("TOKEN");
        localStorage.setItem("auth-logout", Date.now());
    }, []);

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

    useEffect(() => {
        const syncAuth = (event) => {
            if (event.key === "auth-login") {
                setUserToken(localStorage.getItem("TOKEN"));
            }

            if (event.key === "auth-logout") {
                setCurrentUser({});
                setUserToken(null);
            }
        };

        window.addEventListener("storage", syncAuth);
        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    useEffect(() => {
        const handleLogout = () => {
            logout();
        };

        window.addEventListener("auth-logout", handleLogout);
        return () => window.removeEventListener("auth-logout", handleLogout);
    }, [logout]);

    return (
        <StateContext.Provider value={{
            currentUser,
            userToken,
            setCurrentUser,
            login,
            logout,
            questionTypes,
            toast,
            showToast
        }}>
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)