const Sentry = require('@sentry/node');

const UserFlow = require('../models/user-flow.model');
const AnonymFlow = require('../models/anonym-flow.model');
const ErrorFlow = require('../models/error-flow.model');

exports.flow_add = async (req, res, next) => {
    const { flow, uniqID } = req.body

    try {
        const newFlow = req.session.userID
            ? await UserFlow.findOneAndUpdate({ uniqID: uniqID }, { flow: flow, uniqID: uniqID }, { new: true, upsert: true })
            : await AnonymFlow.findOneAndUpdate({ uniqID: uniqID }, { flow: flow, uniqID: uniqID }, { new: true, upsert: true })

        return res.json({
            error: null,
            data: {
                message: "Saved",
                userID: req.session.userID
            },
        });
    } catch (e) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
}

exports.flow_error = async (req, res, next) => {
    const { body } = req
    const { message, filename, lineno, colno, error } = body

    const newErr = new ErrorFlow({ message, filename, lineno, colno, error, dateCreated: Date.now() })

    try {
        const result = await newErr.save()
        return res.json({
            error: null,
            data: {
                message: "Saved",
                userID: req.session.userID
            },
        });
    } catch (e) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
}
