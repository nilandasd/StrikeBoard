const TaskModel = require('../models/Task');
const eventEmitter = require('../util/eventEmitter');

const getTasks = (req, res) => {
	if(req.query.taskId){
        TaskModel.findOne({pid:req.session.project, _id: req.query.taskId}, (err, doc) => {
			if(err){
                return res.status(500).json({message: "ERROR"});
            }
            if(!doc){
                return res.status(404).json({message: "Not Found"});
            }
            return res.status(200).json(doc);
		})
	}else{
        TaskModel.find({pid: req.session.project}, (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(docs);
        });
	}
}

const newTask = (req, res) => {
	if(!req.body.title ||
		(!req.body.stageIndex && req.body.stageIndex !== 0)) return res.status(400).json({message: "Missing title/stageIndex field(s)"});
	if(!/^\d+$/.test(req.body.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.body.stageIndex);
    if(stageIndex < 0) return res.status(400).json({message: "stageIndex must be positive"});
    const task = new TaskModel({
    	pid: req.session.project,
    	title: req.body.title,
    	stageIndex: stageIndex,
        points: 0,
        complete: false,
    });
    task.save(err => {
        if(err){
            return res.status(500).json({message: "ERROR"});
        }else{
            return res.status(201).json(task)               
        }
    });
}

const updateTask = async (req, res) => {
    if(req.body.pid || req.body._id ||req.body.createdAt) return res.status(401).json({message: "Cannot update those fields"});
    if(req.body.title === '') return res.status(400).json({message: "Title cannot be null"});
    if (req.body.stageIndex < 0) return res.status(400).json({ message: "stageIndex must be positive" });
    const update = {...req.body};
    const doc = await TaskModel.findOneAndUpdate(
        { _id: req.params.taskId, pid: req.session.project},
        update,
        { new: true });

    if (doc) {
        return res.status(200).json(doc)
    } else {
        return res.status(404).json({ message: "NOT FOUND" });
    }
}

const deleteTask = async (req, res) => {
    const deleteCount = await TaskModel.deleteOne({pid: req.session.project, _id: req.params.taskId});
    if(deleteCount.deletedCount === 1){
        return res.status(200).json({message: "DELETED"});
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

module.exports = {
	getTasks,
	newTask,
	updateTask,
	deleteTask,
};
