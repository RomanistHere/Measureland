const { Schema, model } = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    flow: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
})

const UserFlow = model('UserFlow', schema)

module.exports = UserFlow
