const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    properties: {
        ratingIDs: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
        // TODO: specify rating fields
        rating: Object,
        averageRating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        numberOfUsers: {
            type: Number,
            required: true
        },
        numberOfComments: {
            type: Number,
            required: true
        },
        numberOfPersonalExperience: {
            type: Number,
            required: true
        }
    },
    location: {
        type: {
            type: String,
            enum : ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}).index({ 'location': '2dsphere' });

// Export the model
module.exports = mongoose.model('Geo', GeoSchema);
