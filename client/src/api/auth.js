const baseURL = 'https://localhost:4000/auth/';

const loginRequest = (email, password) => {
    return fetch(baseURL + 'login', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        })
    })
}

const signUpRequest = (displayName, email, password) => {
    return fetch(baseURL + 'register', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            displayName,
            email,
            password,
        })
    })
}

const logoutRequest = () => {
    return fetch(baseURL + 'logout', {
        method: 'POST',
        credentials: "include",
    })
}

const sessionRequest = () => {
    return fetch(baseURL + 'session');
}

// reset password

// confirmReset

module.exports = {
    signUpRequest,
    loginRequest,
    logoutRequest,
    sessionRequest,
};