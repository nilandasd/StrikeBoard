const ProjectModel = require('../models/Project');
const TaskModel = require('../models/Task');
const UserModel = require('../models/User');
const eventEmitter = require('../util/eventEmitter');

const getProjects = (req, res) => {
    if(req.query.projectId){
        //by setting the query parameter, 
        //only a single project will be returned, and the project ID will be saved
        //to the users session
        ProjectModel.findById(req.query.projectId, (err, doc) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            if(!doc) {
                return res.status(404).json({message: "NOT FOUND"});
            }
            if(doc.members.includes(req.session.user._id)) {
                if(req.session.project !== req.query.projectId){
                    req.session.project = req.query.projectId;
                    return res.status(200).json(doc);
                } else {
                    return res.status(200).json(doc);
                }
                
            } else {
                return res.status(401).json({message: "NOT AUTHORIZED"});
            }
        });
    } else {
        //get all of the users projects if no query parameter was provided
        ProjectModel.find({members: req.session.user._id}, (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(docs);
        });
    }
};

const newProject = (req, res) => {
    if(!req.body.title) return res.status(400).json({message: "Title field required"});
    const project = new ProjectModel({
        title: req.body.title,
        stages: [],
        members: [req.session.user._id]
    });
    project.save(err => {
        if(err){
            console.log(err);
            return res.status(500).json({message: "ERROR"});
        }else{
            console.log(project);
            req.session.project = project._id;
            return res.status(201).json(project)
        }
    });
};

const renameProject = async (req, res) => {
    if(!req.body.title) return res.status(400).json({message: "Title field required"});
    const doc = await ProjectModel.findOneAndUpdate(
        {_id: req.session.project},
        {title: req.body.title},
        {new: true});

    if(doc){
        const payload = {
            type: 'project',
            payload: doc,
        }
        eventEmitter.emit(req.session.project, req.session.user._id, payload);
        return res.status(200).json(doc) 
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
};

const deleteProject = async (req, res) => {
    const deleteCount = await ProjectModel.deleteOne({_id: req.session.project});
    if(deleteCount){
        await TaskModel.deleteMany({pid: req.session.project})
        return res.status(200).json({message: "DELETED"})
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
};

const addMember = (req, res) => {
    UserModel.findOne({email: req.body.email}, async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "ERROR" });
        }
        if(!user) {
            return res.status(404).json({ message: "not found"});
        }
        const doc = await ProjectModel.updateOne(
            { _id: req.session.project, members: {$nin: user._id}},
            { $push: { members: user._id }},
            { new: true });
        if (doc) {
            const payload = {
                type: 'project',
                payload: doc,
            }
            eventEmitter.emit(req.session.project, req.session.user._id, payload);
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "NOT FOUND" });
        }
    });
};

module.exports = {
    getProjects,
    newProject,
    renameProject,
    deleteProject,
    addMember,
};
