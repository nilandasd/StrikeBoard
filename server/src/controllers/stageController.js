const {Project, Task} = require('../models/models');

const addStage = async (req, res) => {
    if(req.body.stage) return res.status(400).json({message: "Stage field required"});
    const doc = await Project.updateOne(
        {_id: req.session.project},
        {$push: {stages: req.params.stage}});
    if(doc.modifiedCount === 1){
        return res.status(200).json({message: "stage CREATED"}) 
    }else{
        return res.status(404).json({message: "NOT FOUND"});
    }
}

const renameStage = async (req, res) => {
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const doc = await Project.findOne({_id: req.session.project});
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
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const doc = await Project.findOne({_id: req.session.project});

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
            await Task.deleteMany({_id: req.session.project, stage: stageTitle});
            return res.status(200).json({message: 'stage deleted'});
        }
    });
}

const getTasks = async (req, res) => {
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const tasks = await Task.find({_id: req.session.project, stage: stageIndex});
    return res.status(200).json(tasks);
}

const moveTasks = async (req, res) => {
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    if(req.body.direction === 'forward'){
		return res.status(200).json(await Task.update({_id: req.session.project, stage: stageIndex}, {stage: stageIndex+1}));
    }else{
    	if(stageIndex === 0) return res.status(400).json({message: "stages cannot be moved further"});
    	return res.status(200).json(await Task.update({_id: req.session.project, stage: stageIndex}, {stage: stageIndex-1}));
    }
}

const deleteTasks = async (req, res) => {
    if(!req.params.stageIndex) return res.status(400).json({message: "stageIndex field required"});
    if(!/^\d+$/.test(req.params.stageIndex)) return res.status(400).json({message: "stageIndex must be a number"});
    const stageIndex = Number(req.params.stageIndex);
    const deleted = await Task.deleteMany({_id: req.session.project, stage: stageTitle});
    return res.status(200).json({message: `${deleted.deletedCount} stages deleted`});
}

module.exports = {
	addStage,
	renameStage,
	deleteStage,
	getTasks,
	deleteTasks,
	moveTasks
}