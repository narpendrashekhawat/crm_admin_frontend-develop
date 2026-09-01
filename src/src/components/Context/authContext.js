import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken) setAuthToken(storedToken);
        if (storedUserId) setUserId(storedUserId); 
    }, []);

    const saveAuthData = (apiToken, apiData) => {
        if (apiData?.id) {
            localStorage.setItem('authToken', apiToken);
            localStorage.setItem('userId', apiData.id);
            setAuthToken(apiToken);
            setUserId(apiData.id);
            console.log(apiData, 'apiData')
        } else {
            console.error("Invalid API data structure:", apiData);
        }
    };
    const removeAuthData = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setAuthToken(null);
        setUserId(null);
    
    };
    return (
        <AuthContext.Provider value={{ authToken, saveAuthData, removeAuthData,userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);