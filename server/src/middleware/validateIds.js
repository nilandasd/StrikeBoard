const mongoose = require('mongoose');

const validateIds = (req, res, next) => {
	try{
        if(req.params.projectId) {
        	mongoose.Types.ObjectId(req.params.projectId);
        }
        if(req.params.taskId) {
        	mongoose.Types.ObjectId(req.params.taskId);
        }
        if(req.params.userId) {
        	mongoose.Types.ObjectId(req.params.userId);
        }
        if(req.query.projectId) {
        	mongoose.Types.ObjectId(req.query.projectId);
        }
        if(req.query.taskId) {
        	mongoose.Types.ObjectId(req.query.taskId);
        }
    }catch (err) {
    	console.log(err);
        return res.status(400).json({message: "Invalid objectId"});
    }
    next();
}

module.exports = {
  validateIds
}
