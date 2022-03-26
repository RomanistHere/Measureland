// from tutorial: https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications

const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
	file: {
		level: 'info',
		filename: `${appRoot}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
};

const logger = winston.createLogger({
	transports: [
		new winston.transports.File(options.file),
	],
	exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
	write (message, encoding) {
		logger.info(message);
	},
};

module.exports = logger;
