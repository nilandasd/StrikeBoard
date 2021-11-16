const {Project, Task} = require('../models/models');

const getTasks = (req, res) => {
	if(req.query.taskId){
		Task.findOne({pid:req.session.project, _id: req.query.taskId}, (err, doc) => {
			if(err){
                return res.status(500).json({message: "ERROR"});
            }
            if(!doc){
                return res.status(404).json({message: "Not Found"});
            }
            return res.status(200).json(doc);
		})
	}else{
		Task.find({pid: req.session.project}, (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(docs);
        });
	}
}

const newTask = (req, res) => {
	if(!req.body.title ||
		req.body.stageIndex) return res.status(400).json({message: "Missing title/stageIndex field(s)"});
	if(!/^\d+$/.test(req.body.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.body.stageIndex);
    if(stageIndex < 0) return res.status(400).json({message: "stageIndex must be positive"});
    const task = new Task({
    	pid: req.session.project,
    	title: req.body.title,
    	stage: stageIndex,
    });
    task.save(err => {
        if(err){
        	console.log(err);
            return res.status(500).json({message: "ERROR"});
        }else{
            return res.status(201).json(task)               
        }
    });
}

const updateTask = async (req, res) => {
    if(req.body.pid || req.body._id ||req.body.createdAt) return res.status(401).json({message: "Cannot update those fields"});
    if(req.body.title === '') return res.status(400).json({message: "Title cannot be null"});
    try{
        const doc = await Task.updateOne(
            {_id: req.params.taskId, pid: req.session.project},
            req.body);
        if(doc.modifiedCount === 1){
            return res.status(200).json({message: "update OK"}) 
        }else{
            return res.status(404).json({message: "NOT FOUND"});
        }
	} catch {
		return res.status(400).json({message: "Schema Violation"});
	}


}

const deleteTask = async (req, res) => {
	console.log(req.session.project);
	console.log(req.params.taskId);
	const deleteCount = await Task.deleteOne({pid: req.session.project, _id: req.params.taskId});
	console.log(deleteCount);
    if(deleteCount.deletedCount === 1){
        return res.status(200).json({message: "DELETED"});
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

module.exports = {
	getTasks,
	newTask,
	updateAllTasks,
	updateTask,
	deleteTask
}
