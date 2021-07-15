require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const MongoStore = require('connect-mongo');
const MongoLimitStore = require('rate-limit-mongo');
const rateLimit = require("express-rate-limit");
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const geoRouter = require('./routes/geo.route');
const userRouter = require('./routes/user.route');
const flowRouter = require('./routes/flow.route');
const winston = require('./helpers/winston');

const app = express();

Sentry.init({
  dsn: "https://f93dacf437a74bd79d5eead86a2c470c@o920493.ingest.sentry.io/5866699",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

const dev_db_url = process.env.DEV_DB_PATH;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.collections.geos.createIndex({ location : "2dsphere" })

app.disable('x-powered-by');

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1);

// sessions
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET.split(','),
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoDB,
        touchAfter: 12 * 3600 // twice a day
    }),
    proxy: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000 // two weeks
    }
}));
app.use(cors({
    origin: process.env.CORS_PATH,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true // enable set cookie
}));

const geoLimiter = rateLimit({
    store: new MongoLimitStore({
        uri: mongoDB,
        expireTimeMs: 10 * 60 * 1000,
        collectionName: 'expressRateGeo',
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    }),
    windowMs: 10 * 60 * 1000,
    max: 150,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests, please try again later' });
    }
});

const flowLimiter = rateLimit({
    store: new MongoLimitStore({
        uri: mongoDB,
        expireTimeMs: 10 * 60 * 1000,
        collectionName: 'expressRateFlow',
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
    }),
    windowMs: 10 * 60 * 1000,
    max: 20
});

// routes
app.use('/api/geo', geoLimiter, geoRouter);
// user api limited in user.route.js
app.use('/api/user', userRouter);
app.use('/api/flow', flowLimiter, flowRouter);

// logging and errors
app.use(Sentry.Handlers.errorHandler());
app.use(morgan('combined', { stream: winston.stream }));

mongoose.Model.on('index', err => {
    if (err) {
        Sentry.captureException(err);
        console.error(err);
    }
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log('The server is running on port number ' + port);
});
