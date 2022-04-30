require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const MongoLimitStore = require('rate-limit-mongo');
const rateLimit = require("express-rate-limit");
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const isProd = process.env.IS_PROD === '1';
const isAdmin = process.env.IS_ADMIN === '1';

const adminRouter = isAdmin ? require('./routes/admin.route') : null;
const geoRouter = require('./routes/geo.route');
const pointsOfInterestRouter = require('./routes/points-of-interest.route');
const userRouter = require('./routes/user.route');
const flowRouter = require('./routes/flow.route');
const externalApiRouter = require('./routes/externalApi.route');
const winston = require('./helpers/winston');

const app = express();

if (isProd) {
	Sentry.init({
		dsn: "https://f93dacf437a74bd79d5eead86a2c470c@o920493.ingest.sentry.io/5866699",
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Tracing.Integrations.Express({ app }),
		],
		tracesSampleRate: 1.0,
	});
}

const dev_db_url = process.env.DEV_DB_PATH;
const mongoDB = isProd && process.env.MONGODB_URI ? process.env.MONGODB_URI : dev_db_url;

mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.collections.geos.createIndex({ location : "2dsphere" });

app.disable('x-powered-by');

if (isProd) {
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
	app.set('trust proxy', 1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sessions
app.use(cookieParser());
app.use(session({
	name: 'cookes',
	secret: process.env.SESSION_SECRET.split(','),
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: mongoDB,
		touchAfter: 12 * 3600, // twice a day
	}),
	proxy: isProd,
	cookie: {
		secure: isProd,
		httpOnly: isProd,
		sameSite: true,
		domain: isProd ? 'measureland.org' : 'localhost',
		maxAge: 2419200000, // 4 weeks
	},
}));
app.use(cors({
	origin: isProd ? [ process.env.CORS_PATH, new RegExp(process.env.CORS_REGEX) ] : process.env.CORS_PATH_DEV,
	methods: [ 'GET', 'POST', 'DELETE' ],
	credentials: true, // enable set cookie
}));

const flowLimiter = rateLimit({
	store: new MongoLimitStore({
		uri: mongoDB,
		expireTimeMs: 10 * 60 * 1000,
		collectionName: 'expressRateFlow',
		errorHandler: console.error.bind(null, 'rate-limit-mongo'),
	}),
	windowMs: 10 * 60 * 1000,
	max: 20,
});
app.use('/api/flow', flowLimiter, flowRouter);

app.use(csurf({
	cookie: false,
}));

const geoLimiter = rateLimit({
	store: new MongoLimitStore({
		uri: mongoDB,
		expireTimeMs: 10 * 60 * 1000,
		collectionName: 'expressRateGeo',
		errorHandler: console.error.bind(null, 'rate-limit-mongo'),
	}),
	windowMs: 10 * 60 * 1000,
	max: 150,
	handler: (req, res) => {
		res.status(429).json({ error: 'Too many requests, please try again later' });
	},
});

// routes
app.use('/api/geo', geoLimiter, geoRouter);
app.use('/api/poi', geoLimiter, pointsOfInterestRouter);
// user api limited in user.route.js
app.use('/api/user', userRouter);
app.use('/api/external', externalApiRouter);
if (isAdmin) {
	app.use('/api/admin', adminRouter);
}

app.use(function (err, req, res, next) {
	console.log(err.message);
	if (err.code !== 'EBADCSRFTOKEN')
		return next(err);

	// handle CSRF token errors here
	return res.status(403).json({ error: err });
});

// logging and errors
if (isProd) {
	app.use(Sentry.Handlers.errorHandler());
	app.use(morgan('combined', { stream: winston.stream }));
}

mongoose.Model.on('index', err => {
	if (err) {
		Sentry.captureException(err);
		console.error(err);
	}
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
	console.log(`The server is running on port number ${port}`);
});
