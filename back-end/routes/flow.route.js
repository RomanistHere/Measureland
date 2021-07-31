const router = require("express").Router();

const flow_controller = require('../controllers/flow.controller');

router.post('/add', flow_controller.flow_add);
router.post('/error', flow_controller.flow_error);

module.exports = router;
