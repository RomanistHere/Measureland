require('dotenv').config();
const router = require("express").Router();
const externalApiController = require('../controllers/externalApi.controller');

router.get('/openweathermap-air_pollution/:params', externalApiController.getOpenWeatherAirPollution);
router.get('/locationiq-address/:params', externalApiController.getLocationIqAddress);
router.get('/telegram-login_check/:params', externalApiController.checkTelegramLogin);

router.post('/translate_text', externalApiController.translateText);

module.exports = router;
