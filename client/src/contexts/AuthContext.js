import React, { useState, useContext, useEffect } from 'react';

import {
    loginRequest,
    sessionRequest,
    signUpRequest,
    logoutRequest,
} from '../api/auth';

import { 
    updateUserRequest,
} from '../api/user';

const AuthContext = React.createContext();

export const useAuth =() => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true); 

    const login = async (email, password) => {
        const response = await loginRequest(email, password);
        if (response.ok) {
            const json = await response.json();
            setCurrentUser(json);
            return 'SUCCESS';
        } else {
            return 'UNAUTHORIZED';
        }
    }

    const signUp = async (displayName, email, password) => {
        const response = await signUpRequest(displayName, email, password);
        if (response.ok) {
            const json = await response.json();
            setCurrentUser(json);
            return 'SUCCESS';
        } else if(response.status === 409){
            return 'EMAIL_TAKEN';
        } else {
            return 'SERVER_ERROR';
        }
    }

    const logout = async () => {
        await logoutRequest();
        setCurrentUser(undefined);
    }

    const updateUser = async (displayName, photoUrl) => {
        if(displayName.length === 0) {
            displayName = currentUser.displayName
        }
        if (photoUrl.length === 0) {
            photoUrl = currentUser.photoUrl
        }
        const response = await updateUserRequest(displayName, photoUrl);
        if (response.ok) {
            const json = await response.json();
            setCurrentUser(json);
            return 'SUCCESS';
        } else {
            return 'SERVER_ERROR';
        }
    }

    useEffect(() => {
        (async () => {
            const response = await sessionRequest();
            if(response.ok) {
                const json = await response.json();
                setCurrentUser(json);
            }
            setLoading(false);
        })()
    }, []);

    const value = {
        currentUser,
        updateUser,
        login,
        signUp,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;