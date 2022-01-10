const baseURL = 'https://strikeboard.net/api' + '/tasks/';

const getTasksRequest = () => {
    return fetch(baseURL, {
        credentials: "include",
    });
}

const newTaskRequest = (title, stageIndex) => {
    return fetch(baseURL, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title, stageIndex}),
    });
};

const deleteTaskRequest = (taskId) => {
    return fetch(baseURL + `${taskId}`, {
        method: 'DELETE',
        credentials: "include",
    });
};

const updateTaskRequest = (taskId, body) => {
    return fetch(baseURL + `${taskId}`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};

module.exports = {
    getTasksRequest,
    newTaskRequest,
    deleteTaskRequest,
    updateTaskRequest,
};
