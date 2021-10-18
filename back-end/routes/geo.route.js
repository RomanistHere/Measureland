const router = require("express").Router();

const geo_controller = require('../controllers/geo.controller');

router.post('/add', geo_controller.geo_add);
router.post('/react_comment', geo_controller.geo_react_comment);
router.post('/react_rating', geo_controller.rating_react);

router.get('/read_loc/:coords', geo_controller.geo_location);
router.get('/read_nearby/:coords', geo_controller.geo_location_nearby);
router.get('/read_bounds/:coords', geo_controller.geo_location_by_bounds);
router.get('/read_comments/:geoID', geo_controller.geo_comments);
router.get('/read_rating/:ratingID', geo_controller.rating_get);

module.exports = router;
