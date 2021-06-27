require('dotenv').config()
const router = require("express").Router();
const MongoLimitStore = require('rate-limit-mongo');
const rateLimit = require("express-rate-limit");

const user_controller = require('../controllers/user.controller');

const dev_db_url = `${process.env.MONGODB_URI}`;

const mediumLimiter = rateLimit({
    store: new MongoLimitStore({
        uri: dev_db_url,
        expireTimeMs: 20 * 60 * 1000,
        collectionName: 'expressRateUser',
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    }),
    windowMs: 20 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests, please try again later' });
    }
});

const hardLimiter = rateLimit({
    store: new MongoLimitStore({
        uri: dev_db_url,
        expireTimeMs: 20 * 60 * 1000,
        collectionName: 'expressRateUser',
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    }),
    windowMs: 20 * 60 * 1000,
    max: 20,
    // skipFailedRequests: true,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests, please try again later' });
    }
});

router.post('/register', hardLimiter, user_controller.user_register);
router.post('/login', mediumLimiter, user_controller.user_login);
router.post('/onboard', hardLimiter, user_controller.user_onboard);
router.post('/reverify', hardLimiter, user_controller.user_reverify);
router.post('/language', mediumLimiter, user_controller.user_language);
router.post('/reset_pass', mediumLimiter, user_controller.user_reset_password);
router.post('/change_pass', mediumLimiter, user_controller.user_change_password);

router.get('/verify/:token', mediumLimiter, user_controller.user_verify);
router.get('/check_user', mediumLimiter, user_controller.user_check);
router.get('/read_places', mediumLimiter, user_controller.user_places);

router.delete('/logout', mediumLimiter, user_controller.user_logout);

module.exports = router;
