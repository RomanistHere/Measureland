const router = require("express").Router();

const POI_controller = require('../controllers/points-of-interest.controller');

router.post('/add', POI_controller.POI_add);

router.get('/read_bounds/:coords', POI_controller.POI_get_by_bounds);

module.exports = router;
