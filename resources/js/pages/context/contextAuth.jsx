import React, { useContext, useState, useEffect, createContext } from "react";
import {  Navigate } from 'react-router-dom';
const StateContext = createContext({
    user: null,
    token: null,
    expiresIn: null,
    setUser: () => { },
    setToken: () => { }
});
export const ContextProvider = ({ children }) => {
    // const navigate = useNavigate();

    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem('USER');
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const [expiresIn, _setExpiresIn] = useState(localStorage.getItem('EXPIRES_IN'));

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
            const expireTime = Date.now() + expiresIn * 1000; 
            _setExpiresIn(expireTime);
            localStorage.setItem('EXPIRES_IN', expireTime);
        } else {
            _setToken(null);
            _setExpiresIn(null);
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('EXPIRES_IN');
        }
    };

    useEffect(() => {
        if (token && expiresIn) {
            const interval = setInterval(() => {
                const now = Date.now();
                if (now >= expiresIn) {
                    setToken(null);
                    setUser(null);
                    <Navigate to='/login' />

                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [token, expiresIn]);

    return (
        <StateContext.Provider value={{
            user,
            token,
            expiresIn, 
            setUser,
            setToken
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
