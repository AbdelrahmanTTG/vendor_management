import React, { useContext, useState, useEffect, createContext } from "react";
import axiosClient from "../../pages/AxiosClint";

const StateContext = createContext({
    user: null,
    token: null,
    expiresIn: null,
    setUser: () => { },
    setToken: () => { }
});

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem('USER');
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [expiresIn, _setExpiresIn] = useState(localStorage.getItem('EXPIRES_IN'));
    // const [showWarning, setShowWarning] = useState(false);
    // const [remainingTime, setRemainingTime] = useState(0);

    const setUser = (user) => {
        _setUser(user);
        if (user) {
            localStorage.setItem('USER', JSON.stringify(user));
        } else {
            localStorage.removeItem('USER');
        }
    };

    const setToken = (token, expiresIn) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
            const expireTime = Date.now() + (expiresIn - 300) * 1000;
            _setExpiresIn(expireTime);
            localStorage.setItem('EXPIRES_IN', expireTime);
        } else {
            _setToken(null);
            _setExpiresIn(null);
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('EXPIRES_IN');
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axiosClient.post('refreshToken', {}, {
            });
            const newToken = response.data.token;
            const newExpiresIn = response.data.expires_in;

            setToken(newToken, newExpiresIn);
         
        } catch (error) {
            setToken(null);
            setUser(null);
         
            localStorage.removeItem('USER');
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('EXPIRES_IN');
        }
    };

    // useEffect(() => {
    //     const storedExpiresIn = localStorage.getItem('EXPIRES_IN');
    //     if (storedExpiresIn) {
    //         const now = Date.now();
    //         const timeLeft = parseInt(storedExpiresIn) - now;
    //         if (timeLeft > 0) {
    //             // setRemainingTime(Math.ceil(timeLeft / 1000));
    //             // setShowWarning(timeLeft <= 300000);
    //         }
    //     }
    // }, []);

    useEffect(() => {
        if (token && expiresIn) {
            const interval = setInterval(() => {
                const now = Date.now();
                const timeLeft = expiresIn - now;
                if (timeLeft <= 0) {
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('USER');
                    localStorage.removeItem('ACCESS_TOKEN');
                    localStorage.removeItem('EXPIRES_IN');
                } else if (timeLeft <= 300000) {
                    
                    refreshToken()
                    console.log("refresh token")
                }
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [token, expiresIn]);

    // const hideWarning = () => {
    //     setShowWarning(false);
    //     setRemainingTime(0);
    // };
    // useEffect(() => {
    //     if (showWarning) {
    //         const timeout = setTimeout(() => {
    //             hideWarning();
    //         }, remainingTime * 1000);

    //         return () => clearTimeout(timeout);
    //     }
    // }, [showWarning, remainingTime]);

    // const formatTime = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const secs = seconds % 60;
    //     return `${minutes} minutes and ${secs} seconds`;
    // };

    // const notificationStyle = {
    //     backgroundColor: 'rgb(219, 87, 99)',
    //     color: 'white',
    //     padding: '10px',
    //     position: 'fixed',
    //     top: '10px',
    //     right: '10px',
    //     borderRadius: '5px',
    //     zIndex: 1000,
    //     animation: 'fadeIn 0.5s ease-in',
    // };

    // const fadeInKeyframes = `
    //     @keyframes fadeIn {
    //         from {
    //             opacity: 0; 
    //         }
    //         to {
    //             opacity: 1; 
    //         }
    //     }
    // `;

    // useEffect(() => {
    //     const styleSheet = document.createElement("style");
    //     styleSheet.type = "text/css";
    //     styleSheet.innerText = fadeInKeyframes;
    //     document.head.appendChild(styleSheet);
    //     return () => {
    //         document.head.removeChild(styleSheet);
    //     };
    // }, []);

    return (
        <StateContext.Provider value={{
            user,
            token,
            expiresIn,
            setUser,
            setToken,
            refreshToken
        }}>
            {children}
            {/* {showWarning && (
                <div style={{ ...notificationStyle, display: 'flex', flexDirection: 'column' }}>
                    <span>{formatTime(remainingTime)} remains until the token expires!</span>
                    <button
                        onClick={refreshToken}
                        style={{
                            alignSelf: 'flex-end', 
                            backgroundColor: 'white',
                            color: 'rgb(219, 87, 99)',
                            border: 'none',
                            padding: '5px',
                            borderRadius: '3px',
                            marginTop: '10px'
                        }}
                    >
                        Refresh Token
                    </button>
                </div>



            )} */}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
