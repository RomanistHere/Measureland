require('dotenv').config()
const router = require("express").Router();
const MongoLimitStore = require('rate-limit-mongo');
const rateLimit = require("express-rate-limit");

const user_controller = require('../controllers/user.controller');

const isProd = process.env.IS_PROD === '1';
const dev_db_url = process.env.DEV_DB_PATH;
const mongoDB = isProd && process.env.MONGODB_URI ? process.env.MONGODB_URI : dev_db_url;

const mediumLimiter = rateLimit({
    store: new MongoLimitStore({
        uri: mongoDB,
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
        uri: mongoDB,
        expireTimeMs: 20 * 60 * 1000,
        collectionName: 'expressRateUser',
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    }),
    windowMs: 20 * 60 * 1000,
    max: 30,
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
router.post('/feedback', mediumLimiter, user_controller.user_feedback);
router.post('/tasks_vote', mediumLimiter, user_controller.vote_for_task);

router.get('/verify/:token', mediumLimiter, user_controller.user_verify);
router.get('/check_user', mediumLimiter, user_controller.user_check);
router.get('/read_places', mediumLimiter, user_controller.user_places);
router.get('/ask_more_ratings', mediumLimiter, user_controller.ask_more_ratings);
router.get('/read_votes/:id', user_controller.read_votes);

router.delete('/logout', mediumLimiter, user_controller.user_logout);

module.exports = router;
