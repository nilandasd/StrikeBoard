const baseURL = 'http://strikeboard.net/api' + '/projects/';

const allProjectsRequest = () => {
    return fetch(baseURL, {
        credentials: "include",
    });
};

const newProjectRequest = (title) => {
    return fetch(baseURL, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title}),
    });
};

const selectProjectRequest = (projectId) => {
    return fetch(baseURL + `?projectId=${projectId}`, {
        credentials: "include",
    });
};

const updateProjectTitleRequest = (title) => {
    return fetch(baseURL, {
        method: 'PATCH',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
};


const deleteProjectRequest = () => {
    return fetch(baseURL, {
        method: 'DELETE',
        credentials: "include",
    });
};

const inviteMemberRequest = (email) => {
    return fetch(baseURL + 'members', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    });
}


module.exports = {
    allProjectsRequest,
    newProjectRequest,
    selectProjectRequest,
    deleteProjectRequest,
    updateProjectTitleRequest,
    inviteMemberRequest,
};