const Sentry = require('@sentry/node');
const sanitize = require('mongo-sanitize');

const AnonymFlow = require('../models/anonym-flow.model');
const ErrorFlow = require('../models/error-flow.model');

exports.flow_add = async (req, res, next) => {
	const { flowString, uniqID } = req.body;
	const sanitizedID = sanitize(uniqID);

	try {
		const newFlow = await AnonymFlow.findOneAndUpdate({
			uniqID: sanitizedID,
		}, {
			flow: sanitize(flowString),
			uniqID: sanitizedID,
		}, {
			new: true,
			upsert: true,
		});

		return res.json({
			error: null,
			data: {
				message: "Flow saved",
				// userID: req.session.userID
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.flow_error = async (req, res, next) => {
	const { body } = req;
	const { message, filename, lineno, colno, error } = body;

	const newErr = new ErrorFlow({ message, filename, lineno, colno, error, dateCreated: Date.now() });

	try {
		const result = await newErr.save();

		return res.json({
			error: null,
			data: {
				message: "Saved",
				userID: req.session.userID,
			},
		});
	} catch (e) {
		Sentry.captureException(e);
		return res.status(400).json({ e });
	}
};
