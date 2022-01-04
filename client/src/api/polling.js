
const baseURL = 'https://18.144.164.165:4000' + '/poll/';

const pollRequest = () => {
    return fetch(baseURL, {
        credentials: "include",
    });
};

module.exports = {
    pollRequest,
};