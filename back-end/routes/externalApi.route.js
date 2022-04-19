require('dotenv').config();
const router = require("express").Router();
const externalApiController = require('../controllers/externalApi.controller');

router.post('/translate_text', externalApiController.translateText);

module.exports = router;
