const mongoose = require('mongoose');
const {Project, Task} = require('../models/models');

const getProjects = (req, res) => {
    if(req.query.projectId){
        //GET PROJECT BY ID   
        Project.findById(req.query.projectId, (err, doc) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            if(!doc) {
                return res.status(404).json({message: "NOT FOUND"});
            }
            if(doc.members.includes(req.user._id)) {
                return res.status(200).json({message: "OK", project: doc})
            } else {
                return res.status(401).json({message: "NOT AUTHORIZED"});
            }
        });
    } else {
        //GET ALL OF USERS PROJECTS
        Project.find({members: req.user._id}, (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            if(!docs) {
                return res.status(404).json({message: "NOT FOUND"});
            }
            return res.status(200).json(docs)
            
        });
    }
}

const newProject = (req, res) => {
    if(!req.body.title) return res.status(400).json({message: "Title field required"});
    const date = new Date();
    const createdAt = '' + date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    const project = new Project({
        createdAt,
        title: req.body.title,
        stages: [],
        members: [req.user._id]
    });
    project.save(err => {
        if(err){
            console.log(err);
            return res.status(500).json({message: "ERROR"});
        }else{
            return res.status(201).json(project)   
        }
    });
}

const renameProject = async (req, res) => {
    if(!req.body.title) return res.status(400).json({message: "Title field required"});
    const doc = await Project.updateOne(
        {members: req.user._id, _id: req.params.projectId},
        {title: req.body.title});

    if(doc.modifiedCount === 1){
        return res.status(200).json({message: "rename OK"}) 
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }

}

const deleteProject = async (req, res) => {
    const deleteCount = await Project.deleteOne({members: req.user._id, _id: req.params.projectId});
    if(deleteCount){
        await Task.deleteMany({pid: req.params.projectId})
        return res.status(200).json({message: "DELETED"})
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

const addStage = async (req, res) => {
    if(req.body.stage) return res.status(400).json({message: "Stage field required"});
    const doc = await Project.updateOne(
        {members: req.user._id, _id: req.params.projectId},
        {$push: {stages: req.params.stage}});

    console.log(doc.modifiedCount)
    if(doc.modifiedCount === 1){
        return res.status(200).json({message: "stage CREATED"}) 
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

const renameStage = async (req, res) => {
    if(!req.body.stageIndex) return res.status(400).json({message: "index field required"});
    if(!/^\d+$/.test(req.body.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.body.stageIndex);
    const doc = await Project.findOne({members: req.user._id, _id: req.params.projectId});
    console.log(doc);
    if(!doc) return res.status(404).json({message: "NOT FOUND"});

    if(typeof stageIndex !== 'number' ||
        stageIndex < 0 ||
        doc.stages.length <= stageIndex)
            return res.status(400).json({message: "bad stage index"})

    doc.stages[stageIndex] = req.params.stage;

    doc.save(err => {
        if(err){
            return res.status(500).json({message: "ERROR"});
        }else{
            return res.status(200).json({message: 'stage renamed'});
        }
    });

}

const deleteStage = async (req, res) => {
    if(!req.body.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.body.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.body.stageIndex);
    const doc = await Project.findOne({members: req.user._id, _id: req.params.projectId});

    if(!doc) return res.status(404).json({message: "NOT FOUND"});

    if(typeof stageIndex !== 'number' ||
        stageIndex < 0 ||
        doc.stages.length <= stageIndex)
            return res.status(400).json({message: "bad stage index"})

    const stageTitle =  doc.stages.stageIndex;
    doc.stages.splice(stageIndex, 1);

    doc.save(async err => {
        if(err){
            return res.status(500).json({message: "ERROR"});
        }else{
            await Task.deleteMany({pid: req.params.projectId, stage: stageTitle});
            return res.status(200).json({message: 'stage deleted'});
        }
    });
}

module.exports = {
    getProjects,
    newProject,
    renameProject,
    deleteProject,
    addStage,
    renameStage,
    deleteStage
};
