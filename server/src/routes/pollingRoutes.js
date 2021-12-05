const { Router } = require('express');
const projectIsSelected = require('../middleware/projectIsSelected');
const eventEmitter = require('../util/eventEmitter');
const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.post('/', async (req, res) => {

    const sendEvent = (eventObject) => {
        res.status(200).json(eventObject);
    }

    eventEmitter.once(`${req.session.project}`, sendEvent);

    req.on("close", function () {
        console.log('removed event listener');
        eventEmitter.removeListener(`${req.session.project}`, sendEvent);
    });
});

module.exports = router;
