const router = require("express").Router();

const POI_controller = require('../controllers/points-of-interest.controller');

router.post('/add', POI_controller.POI_add);
router.post('/react', POI_controller.POI_react);
router.post('/add_comment', POI_controller.POI_add_comment);

router.get('/read_bounds/:coords', POI_controller.POI_get_by_bounds);
router.get('/read_single/:coords', POI_controller.POI_get_single);

// todo
// router.delete('/delete_point/:pointID', POI_controller.POI_delete);
// router.delete('/delete_comment/:commentID', POI_controller.POI_delete_comment);

module.exports = router;
