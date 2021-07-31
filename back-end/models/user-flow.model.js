const { Schema, model } = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    uniqID: {
        type: String,
    },
    flow: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const UserFlow = model('UserFlow', schema)

module.exports = UserFlow
