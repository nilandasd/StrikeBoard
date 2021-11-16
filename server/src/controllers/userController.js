const {User} = require('../models/models');


const getProjectUsernames = (req, res) => {
	User.find({_id: { $in: req.body.members}}, 'username _id email photoUrl', (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(docs);
    });
}

const getUser = (req, res) => {
	User.find({_id: req.user._id, 'username _id email photoUrl', (err, doc) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(doc);
    });
}

const updateUser = async (req, res) => {
	if(req.body.hash !== undefined ||
		req.body.salt !== undefined) return return res.status(409).json({message: "Cannot update hash/salt"});
	try{
		const updateCount = await User.updateOne({_id: req.user._id}, req.body);
	}catch{
		return res.status(500).json({message: "ERROR"});
	}
	
    if(updateCount !== 1){
        return res.status(404).json({message: "this shouldn't ever happen..."});
    }
    return res.status(200).json(doc);
}