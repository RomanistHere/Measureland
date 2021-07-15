const Sentry = require('@sentry/node');

const UserFlow = require('../models/user-flow.model');
const AnonymFlow = require('../models/anonym-flow.model');

exports.flow_add = async (req, res, next) => {
    console.log('flow_add')
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
    } catch (e) {
        Sentry.captureException(e);
        // no point sending back anything
    }
}
