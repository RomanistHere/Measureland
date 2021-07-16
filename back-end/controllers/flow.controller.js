const Sentry = require('@sentry/node');

const UserFlow = require('../models/user-flow.model');
const AnonymFlow = require('../models/anonym-flow.model');

exports.flow_add = async (req, res, next) => {
    const { body } = req
    const flowString = body.flow
    const flow = flowString.split(',')

    const newFlow = req.session.userID
        ? new UserFlow({
            flow: flow,
            email: req.session.userID
        })
        : new AnonymFlow({
            flow: flow
        })
    try {
        const result = await newFlow.save()
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
