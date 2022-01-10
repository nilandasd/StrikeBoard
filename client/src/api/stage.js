const baseURL = 'http://strikeboard.net/api' + '/stages/';

const newStageRequest = (title) => {
    return fetch(baseURL, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
};

const deleteStageTasksRequest = (stageIndex) => {
    return fetch(baseURL + `tasks/${stageIndex}`, {
        method: 'DELETE',
        credentials: "include",
    });
};

const deleteStageRequest = (stageIndex) => {
    return fetch(baseURL + `${stageIndex}`, {
        method: 'DELETE',
        credentials: "include",
    });
};

const moveStageTasksRequest = (stageIndex, direction) => {
    return fetch(baseURL + `tasks/${stageIndex}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({direction}),
    });
};

const renameStageRequest = (stageIndex, title) => {
    return fetch(baseURL + `${stageIndex}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
};

module.exports = {
    newStageRequest,
    deleteStageRequest,
    deleteStageTasksRequest,
    moveStageTasksRequest,
    renameStageRequest,
};
