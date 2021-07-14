const Geo = require('../models/geo.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

const roundToTen = number =>
    Math.round(10 * number) / 10

const getNewRating = (rating, numberOfUsers, quizRating) => {
    const newKeys = Object.keys(quizRating)

    return newKeys.reduce((acc, key) => {
        const val = quizRating[key]
        const oldVal = rating[key] ? rating[key] : 0
        const newVal = val ? (oldVal * numberOfUsers + val) / (numberOfUsers + 1) : oldVal
        return { ...acc, [key]: roundToTen(newVal) }
    }, {})
}

const additionalProps = ['pets', 'kids', 'parking']

const checkAdditionalProp = prop =>
    additionalProps.some(item => prop === item)

const getFinalRating = (obj) => {
    const keys = Object.keys(obj)
    let mainAsnwersCounter = 0
    let additionalAsnwersCounter = 0
    let sumMain = 0
    let sumAdditional = 0

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const val = obj[key]

        if (val === null)
            continue

        // check what value the property is going to have. Distribution is 75% for main props and 25 for additional ones
        const isAdditionalProp = checkAdditionalProp(key)
        if (isAdditionalProp) {
            sumAdditional = sumAdditional + val
            additionalAsnwersCounter++
        } else {
            sumMain = sumMain + val
            mainAsnwersCounter++
        }
    }

    const mainPart = mainAsnwersCounter !== 0
        ? sumMain / mainAsnwersCounter
        : 0 // 75%
    const additionalPart = additionalAsnwersCounter !== 0
        ? sumAdditional / additionalAsnwersCounter
        : 0 // 25%
    const finalRating = additionalPart !== 0
        ? (mainPart * 3 + additionalPart) / 4
        : mainPart // if no additional ratings

    return {
        answersNumber: mainAsnwersCounter + additionalAsnwersCounter,
        finalRating: finalRating,
    }
}

exports.geo_react_comment = async (req, res) => {
    if (!req.session.userID)
        return res.status(400).json({ error: "User is not logged in" })

    const email = req.session.userID
    const { key, goal } = req.body
    const property = goal === 'like' ? 'likes' : 'dislikes'
    const propertyOpp = goal === 'like' ? 'dislikes' : 'likes'

    try {
        const user = await User.findOne({ email: email });

        if (!user)
            return res.status(400).json({ error: "User not found" });

        const userID = user._id
        const result = await Comment.findOneAndUpdate(
        {
            _id: key
        }, {
            $addToSet: {
                [property]: userID
            }
        }, {
            new: true
        })

        const resultRemove = await Comment.findOneAndUpdate(
        {
            _id: key
        }, {
            $pull: {
                [propertyOpp]: userID
            }
        }, {
            new: true
        })

        return res.json({
            error: null,
            data: {
                message: "Login successful",
                userID: user.email
            },
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const saveComment = async (comment, userID, geoID, username, rating) => {
    const user = await User.findOne({ email: userID });
    const newComment = new Comment({
        user: user._id,
        geo: geoID,
        username,
        comment,
        rating
    });
    try {
        const result = await newComment.save()
        return result
    } catch (e) {
        return e
    }
}

const addGeoToUser = async (userID, geoID, activeRatings, rating, commentID) => {
    try {
        const ratings = commentID
            ? {
                geoID,
                rating,
                commentID,
                dateRated: Date.now()
            }
            : {
                geoID,
                rating,
                dateRated: Date.now()
            }
        const result = await User.findOneAndUpdate(
        { email: userID },
        {
            $addToSet: {
                'properties.ratedLocations': geoID,
                'properties.ratings': ratings
            },
            $set: {
                'properties.activeRatings': activeRatings,
                'properties.lastRated': Date.now(),
            }
        }, {
            new: true
        })
        return result
    } catch (e) {
        return e
    }
}

const dateDiffInDays = (date1, date2) => {
    const msPerDay = 1000 * 60 * 60 * 24
    const a = new Date(date1)
    const b = new Date(date2)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor(Math.abs(utc2 - utc1) / msPerDay)
}

const isRatingActive = (user) => {
    if (user.usergroup === 0)
        return { canUserAdd: true, activeRatings: 3 }

    if (user.properties.activeRatings > 0)
        return { canUserAdd: true, activeRatings: user.properties.activeRatings - 1 }

    const dayDifference = dateDiffInDays(Date.now(), user.properties.lastRated)

    if (dayDifference > 5 && dayDifference <= 10)
        return { canUserAdd: true, activeRatings: 0 }
    else if (dayDifference > 10 && dayDifference <= 15)
        return { canUserAdd: true, activeRatings: 1 }
    else if (dayDifference > 15)
        return { canUserAdd: true, activeRatings: 2 }

    return { canUserAdd: false, activeRatings: null }
}

exports.geo_add = async (req, res, next) => {
    const { body } = req

    if (!req.session.userID)
        return res.status(400).json({ error: "User is not logged in" })

    const userID = req.session.userID

    try {
        const user = await User.findOne({ email: userID })
        if (!user)
            return res.status(400).json({ error: "User is not found" })

        const { canUserAdd, activeRatings } = isRatingActive(user)
        if (!canUserAdd)
            return res.status(400).json({ error: "No active ratings" })

        const geo = await Geo.findOne({
            "location": {
                $near: {
                    $geometry: {
                        type: "Point" ,
                        coordinates: [ ...body.location.coordinates ]
                    },
                    $maxDistance: 700
                }
            }
        })

        const { properties } = body
        const { rating, averageRating, comment, isPersonalExperience } = properties
        if (geo) {
            // check if user rated it already
            const id = geo._id
            const exists = user.properties.ratedLocations.some(val => val.equals(id))
            if (exists)
                return res.status(400).json({ error: "Nearby place is already rated" });
            // update
            const oldProps = geo.properties
            const newRating = getNewRating(oldProps.rating, oldProps.numberOfUsers, rating)
            const { finalRating } = getFinalRating(newRating)
            const numberOfUsers = oldProps.numberOfUsers + 1
            const numberOfComments = comment !== null ? oldProps.numberOfComments + 1 : oldProps.numberOfComments
            const numberOfPersonalExperience = isPersonalExperience ? oldProps.numberOfPersonalExperience + 1 : oldProps.numberOfPersonalExperience

            try {
                const result = await Geo.findOneAndUpdate({
                    _id: geo._id
                }, {
                    $set: {
                        properties: {
                            rating: newRating,
                            averageRating: finalRating,
                            numberOfComments,
                            numberOfPersonalExperience,
                            numberOfUsers
                        }
                    }
                }, {
                    new: true
                })

                const commentSaved = comment ? await saveComment(comment, userID, result._id, user.username, averageRating) : null
                const commentID = commentSaved ? commentSaved._id : null
                const userResult = await addGeoToUser(userID, result._id, activeRatings, rating, commentID)

                return res.json({
                    error: null,
                    data: {
                        message: "Rating updated",
                        coords: result.location.coordinates,
                        averageRating: result.properties.averageRating
                    }
                });
            } catch (e) {
                return res.status(400).json({ error: "Could not save your rating" })
            }
        } else {
            // create
            const newGeo = new Geo({
                properties: {
                    rating: rating,
                    averageRating: averageRating,
                    numberOfComments: comment ? 1 : 0,
                    numberOfPersonalExperience: isPersonalExperience ? 1 : 0,
                    numberOfUsers: 1
                },
                location: body.location
            });
            try {
                const result = await newGeo.save()
                const commentSaved = comment ? await saveComment(comment, userID, result._id, user.username, averageRating) : null
                const commentID = commentSaved ? commentSaved._id : null
                const userResult = await addGeoToUser(userID, result._id, activeRatings, rating, commentID)

                return res.json({
                    error: null,
                    data: {
                        message: "Rating added",
                    },
                });
            } catch (e) {
                return res.status(400).json({ error: "Could not save your rating" })
            }
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.geo_location = async (req, res, next) => {
    const userID = req.session.userID

    const urlParams = new URLSearchParams(req.params.coords)
    const nearCoords = Object.fromEntries(urlParams)
    const arr = nearCoords.latlng.split(',').map(Number)
    try {
        const result = await Geo.findOne({
            "location": {
                $near: {
                    $geometry: {
                        type: "Point" ,
                        coordinates: [ ...arr]
                    },
                    $maxDistance: 50
                }
            }
        }, '-location')

        if (!result)
            return res.status(400).json({ error: 'Location not found' })

        const geoID = result._id
        const user = userID ? await User.findOne({ $and: [
            { email: userID },
            { 'properties.ratedLocations': {
                $in: [geoID]
            }}
        ]}) : null

        const { properties } = result
        const props = {
            ...properties,
            isRated: user ? true : false,
            geoID
        }

        return res.json({
            error: null,
            data: {
                message: "Geolocation found",
                userID: userID ? userID : null,
                properties: props
            },
        })
    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.geo_comments = async (req, res, next) => {
    const userEmail = req.session.userID

    const urlParams = new URLSearchParams(req.params.geoID)
    const { geoID } = Object.fromEntries(urlParams)

    try {
        const result = await Comment.find({ "geo": geoID })
        const user = await User.findOne({ email: userEmail })
        const userID = user ? user._id : 'anon'

        const arrayToSend = result.map(item => {
            return {
                isYours: user ? (userID.equals(item.user) ? true : false) : false,
                isLiked: user ? item.likes.some(item => item.equals(userID)) : false,
                isDisliked: user ? item.dislikes.some(item => item.equals(userID)) : false,
                rating: item.rating,
                comment: item.comment,
                username: item.username,
                liked: item.likes.length,
                disliked: item.dislikes.length,
                id: item._id
            }
        })

        return res.json({
            error: null,
            data: {
                message: "Comments fetched",
                userID: userID ? userID : null,
                array: arrayToSend
            },
        })
    } catch (error) {
        return res.status(400).json({ error })
    }
};

// exports.geo_same_location = async (req, res, next) => {
//     const urlParams = new URLSearchParams(req.params.coords)
//     const nearCoords = Object.fromEntries(urlParams)
//     const arr = nearCoords.latlng.split(',').map(Number)
//
//     try {
//         const result = await Geo.findOne({
//             "location": {
//                 $near: {
//                     $geometry: {
//                         type: "Point" ,
//                         coordinates: [ ...arr ]
//                     },
//                     $maxDistance: 250
//                 }
//             }
//         })
//
//         res.send(result ? true : false)
//     } catch (error) {
//         res.status(400).json({ error })
//     }
// };

exports.geo_location_by_bounds = async (req, res, next) => {
    const { userID } = req.session
    const urlParams = new URLSearchParams(req.params.coords)
    const { bounds, zoom } = Object.fromEntries(urlParams)
    const polygon = JSON.parse(bounds)

    try {
        const result = await Geo.find(
            {
                "location": {
                    $geoWithin: {
                        $polygon: polygon
                    }
                }
            },
            'location.coordinates properties.averageRating',
        )

        return res.json({
            error: null,
            data: {
                message: "Location fetched",
                userID: userID ? userID : null,
                result
            },
        });
    } catch (error) {
        return res.status(400).json({ error })
    }
};

// exports.geo_all = async (req, res, next) => {
//     try {
//         const result = await Geo.find({}, 'location.coordinates properties.averageRating')
//         res.send(result)
//     } catch (error) {
//         res.status(400).json({ error })
//     }
// };

// not used

// exports.geo_delete = function (req, res) {
//     Geo.findByIdAndRemove(req.params.id, function (err) {
//         if (err) return next(err);
//         res.send('Deleted successfully!');
//     })
// };
