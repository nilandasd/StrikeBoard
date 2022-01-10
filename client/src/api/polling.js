const baseURL = 'http://strikeboard.net/api' + '/poll/';

const pollRequest = () => {
    return fetch(baseURL, {
        credentials: "include",
    });
};

module.exports = {
    pollRequest,
};