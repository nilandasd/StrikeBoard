const UserModel = require('../models/User');

const getUsernames = (req, res) => {
    UserModel.find({_id: { $in: req.body.memberIds}}, (err, docs) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(docs);
    });
}

const getUser = (req, res) => {
    UserModel.find({_id: req.user._id}, 'username _id email photoUrl', (err, doc) => {
            if(err){
                return res.status(500).json({message: "ERROR"});
            }
            return res.status(200).json(doc);
    });
}

const updateUser = async (req, res) => {
    const update = {photoUrl: req.body.photoUrl,
        displayName: req.body.displayName }
    const doc = await UserModel.findOneAndUpdate(
        { _id: req.session.user._id },
        update,
        { new: true });

    if (doc) {
        return res.status(200).json(doc)
    } else {
        return res.status(404).json({ message: "NOT FOUND" });
    }
}

module.exports = {
    getUsernames,
    getUser,
    updateUser
}