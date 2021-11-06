import _ from "../firebase";
//ensures app is initialized before getAuth is called
import React, { useState, useContext, useEffect } from 'react'
import { getAuth,
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged,
         sendPasswordResetEmail,
         signOut,
         setPersistence,
         browserSessionPersistence,
         updateProfile,
         signInWithPopup,
         GoogleAuthProvider } from "firebase/auth";
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const AuthContext = React.createContext();

export const useAuth =() => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentuser] = useState();
    const [loading, setLoading] = useState(true); 

    const signup = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
        return updateProfile(auth.currentUser, {
            displayName: email.substring(0, email.indexOf("@"))
        })
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        return signOut(auth);
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    }

    const updateDisplayName = (displayName) => {
        return updateProfile(auth.currentUser, { displayName });
    }

    const updatePhotoUrl = (photoURL) => {
        return updateProfile(auth.currentUser, { photoURL });
    }

    useEffect(() => {
        //react docs says useEffect funcions should not be async
        const nested = async () => {
            await setPersistence(auth, browserSessionPersistence);
            const unsubscribe = await onAuthStateChanged(auth, user => {
                if (user) {
                    setCurrentuser(user)
                } else {
                    setCurrentuser(false);
                }
            })
            setLoading(false);
            return unsubscribe;
        }

        const unsubscribe = nested()
        return unsubscribe;
    }, []);

    const value = {
        currentUser, 
        signup,
        login,
        googleLogin,
        logout,
        resetPassword,
        updateDisplayName,
        updatePhotoUrl
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;