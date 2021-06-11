const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        default: 'Anonym'
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    usergroup: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    properties: {
        ratedLocations: [{ type: Schema.Types.ObjectId, ref: 'Geo' }],
        ratings: [{
            geoID: { type: Schema.Types.ObjectId, ref: 'Geo' },
            commentID: { type: Schema.Types.ObjectId, ref: 'Comment' },
            rating: {
                type: Object
            }
        }],
        ageGrp: {
            type: Number,
            default: 1 // 0 - under 25, 1 - 25-40, 2- 41-55, 3 - 55+
        },
        moneyGrp: {
            type: Number,
            default: 1 // 0 - below average, 1 - average, 2 - above average
        },
        activeRatings: {
            type: Number,
            default: 3
        },
        lastRated: {
            type: Date,
            default: Date.now()
        },
        lang: {
            type: String,
            default: 'en'
        },
        balance: {
            type: Number,
            default: 0
        }
    }
}).index({ 'email': 1 });

// Export the model
module.exports = model('User', UserSchema);
