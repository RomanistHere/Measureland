const router = require("express").Router();

const flow_controller = require('../controllers/flow.controller');

router.post('/add', flow_controller.flow_add);

module.exports = router;
