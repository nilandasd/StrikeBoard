

const baseURL = 'https://18.144.164.165:4000' + '/users/';

const updateUserRequest = (displayName, photoUrl) => {
    return fetch(baseURL, {
        method: 'PATCH',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            displayName,
            photoUrl,
        })
    })
}

const getMembersRequest = (memberIds) => {
    return fetch(baseURL + 'project', {
        credentials: "include",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({memberIds})
    })
}

module.exports = {
    updateUserRequest,
    getMembersRequest,
}