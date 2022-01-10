
const baseURL = 'http://strikeboard.net' + '/poll/';

const pollRequest = () => {
    return fetch(baseURL, {
        credentials: "include",
    });
};

module.exports = {
    pollRequest,
};