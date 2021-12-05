const projectIsSelected = (req, res, next) => {
	if (req.session.project) {
    	next();
    } else {
    	return res.status(409).json({message: "Must select a project to use this route"});
    }
}

module.exports = projectIsSelected

