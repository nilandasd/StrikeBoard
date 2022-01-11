const ProjectModel = require('../models/Project');
const TaskModel = require('../models/Task');

const addStage = async (req, res) => {
    if(!req.body.title) return res.status(400).json({message: "title field required"});
    const doc = await ProjectModel.findOneAndUpdate(
        {_id: req.session.project},
        {$push: {stages: req.body.title}},
        {new: true});
    if(doc){
        return res.status(200).json(doc);
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

const renameStage = async (req, res) => {
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const doc = await ProjectModel.findOne({_id: req.session.project});
    if(!doc) return res.status(404).json({message: "NOT FOUND"});
    if(typeof stageIndex !== 'number' ||
        stageIndex < 0 ||
        doc.stages.length <= stageIndex)
            return res.status(400).json({message: "bad stage index"})

    doc.stages[stageIndex] = req.body.title;
    doc.save(err => {
        if(err){
            return res.status(500).json({message: "ERROR"});
        }else{
            return res.status(200).json({message: 'stage renamed'});
        }
    });
}

const deleteStage = async (req, res) => {
    if (!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if (!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const doc = await ProjectModel.findOne({_id: req.session.project});
    if (typeof stageIndex !== 'number' ||
        stageIndex < 0 ||
        doc.stages.length <= stageIndex)
            return res.status(400).json({message: "bad stage index"});
    doc.stages.splice(stageIndex, 1);
    doc.save(async err => {
        if(err){
            return res.status(500).json({message: "ERROR"});
        } else {
            await TaskModel.deleteMany({pid: req.session.project, stageIndex: stageIndex});
            await TaskModel.updateMany({pid: req.session.project, stageIndex: {$gte: stageIndex}},
                {$inc: {stageIndex: -1}});
            return res.status(200).json({message: 'stage deleted'});
        }
    });
}

// const getTasks = async (req, res) => {
//     if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
//     if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
//     const stageIndex = Number(req.params.stageIndex);
//     const tasks = await TaskModel.find({_id: req.session.project, stage: stageIndex});
//     return res.status(200).json(tasks);
// }

const moveTasks = async (req, res) => {
    if (!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if (!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    if (req.body.direction === 'forward') {
        await TaskModel.updateMany({ pid: req.session.project, stageIndex: stageIndex }, { stageIndex: stageIndex + 1 });
        return res.status(200).json({});
    } else {
    	if (stageIndex === 0) return res.status(400).json({message: "stages cannot be moved further"});
        await TaskModel.updateMany({ pid: req.session.project, stageIndex: stageIndex }, { stageIndex: stageIndex - 1 })
        return res.status(200).json({});
    }
}

const deleteTasks = async (req, res) => {
    if (!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if (!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const deleted = await TaskModel.deleteMany({pid: req.session.project, stageIndex: stageIndex});
    return res.status(200).json({message: `${deleted.deletedCount} stages deleted`});
}

module.exports = {
	addStage,
	renameStage,
	deleteStage,
	deleteTasks,
	moveTasks,
}