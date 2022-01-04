const { Router } = require('express');
const projectIsSelected = require('../middleware/projectIsSelected');
const eventEmitter = require('../util/eventEmitter');
const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.get('/', async (req, res) => {
    const uid = req.session.user._id;
    const sendEvent = (userId, eventObject) => {
        console.log(userId);
        console.log(uid);
        console.log(eventObject);
        if (userId === uid) {
            console.log('dont emit event to users own update');
            return;
        }
        console.log('send response');
        return res.status(200).json(eventObject);
    };

    eventEmitter.on(req.session.project, sendEvent);

    req.on("close", function () {
        console.log('request was closed');
        eventEmitter.removeListener(req.session.project, sendEvent);
    });
});

module.exports = router;
