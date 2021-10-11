const User = require('../models/user.model');
const Rating = require('../models/rating.model');
const Geo = require('../models/geo.model');

const { getFinalRating } = require('./index');

exports.fetchAllUsers = async () => {
    try {
        const users = await User.find({});
        for (let i = 0; i < users.length; i++) {
            const { properties, _id } = users[i];
            const { ratings, ratedLocations } = properties;
            let ratingIDs = [];
            for (let k = 0; k < ratings.length; k++) {
                const { geoID, commentID, rating, dateRated } = ratings[k];
                const doesExist = ratedLocations.find(item => item.equals(geoID));

                if (doesExist) {
                    const userID = _id;
                    const isPersonalExperience = true;
                    const timeline = 2020;
                    const { finalRating } = getFinalRating(rating);
                    const newRating = new Rating({
                        userID,
                        commentID,
                        geoID,
                        rating,
                        averageRating: finalRating,
                        isPersonalExperience,
                        timeline,
                        dateCreated: dateRated,
                    });
                    const saved = await newRating.save();
                    const ratingID = saved._id
                    ratingIDs.push(ratingID);
                    await Geo.findOneAndUpdate({
                        _id: geoID
                    }, {
                        $addToSet: {
                            'properties.ratingIDs': ratingID,
                        }
                    });
                }
            }
            const userUpdated = await User.findOneAndUpdate({
                _id
            }, {
                $set: {
                    'properties.ratingIDs': ratingIDs,
                    'properties.geoIDs': ratedLocations,
                    'properties.wantMoreRatings': false,
                    'properties.lastRatingsAdded': new Date(),
                },
                $unset: {
                    'properties.ratings': "",
                    'properties.ratedLocations': "",
                    'properties.lastRated': "",
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
}
