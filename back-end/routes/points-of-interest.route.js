const router = require("express").Router();

const POI_controller = require('../controllers/points-of-interest.controller');

router.post('/add', POI_controller.POI_add);
router.post('/react', POI_controller.POI_react);

router.get('/read_bounds/:coords', POI_controller.POI_get_by_bounds);
router.get('/read_single/:coords', POI_controller.POI_get_single);

module.exports = router;
