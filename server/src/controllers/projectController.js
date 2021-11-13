const { Project } = require('../models/models');

const getProjects = (req, res) => {

    return res.status(200).json({message: "OK"})
}

const newProject = (req, res) => {
    return res.status(200).json({message: "OK"})
}

const updateProject = (req, res) => {
    return res.status(200).json({message: "OK"})
}

const deleteProject = (req, res) => {
    return res.status(200).json({message: "OK"})
}

module.exports = {
    getProjects,
    newProject,
    updateProject,
    deleteProject
};
