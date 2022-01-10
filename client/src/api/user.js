

const baseURL = 'http://strikeboard.net' + '/users/';

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