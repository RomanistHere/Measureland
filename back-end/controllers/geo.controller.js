const Sentry = require('@sentry/node');
const sanitize = require('mongo-sanitize');

const Geo = require('../models/geo.model');
const User = require('../models/user.model');
const Rating = require('../models/rating.model');
const Comment = require('../models/comment.model');
const PointOfInterest = require('../models/point-of-interest.model');

const { getFinalRating, roundToTen, updateKarma } = require('../helpers/index');

const getNewRating = (rating, numberOfUsers, quizRating) => {
	const newKeys = Object.keys(quizRating);

	return newKeys.reduce((acc, key) => {
		const val = quizRating[key];
		const oldVal = rating[key] ? rating[key] : 0;
		const newVal = val ? (oldVal * numberOfUsers + val) / (numberOfUsers + 1) : oldVal;
		return { ...acc, [key]: roundToTen(newVal) };
	}, {});
};

const saveComment = async (comment, userID, geoID, username, rating) =>
	await new Comment({
		user: userID,
		geo: geoID,
		username,
		comment,
		rating,
	}).save();

const saveRating = async (userID, commentID, geoID, rating, averageRating, isPersonalExperience, timeline) =>
	await new Rating({
		userID,
		commentID,
		geoID,
		rating,
		averageRating,
		isPersonalExperience,
		timeline,
	}).save();

const addGeoToUser = async (userEmail, ratingID, geoID, activeRatings) =>
	await User.findOneAndUpdate({
		email: userEmail,
	}, {
		$addToSet: {
			'properties.ratingIDs': ratingID,
			'properties.geoIDs': geoID,
		},
		$set: {
			'properties.activeRatings': activeRatings - 1,
		},
	}, {
		new: true,
	});

const addRatingRefToGeo = async (geoID, ratingID) =>
	await Geo.findOneAndUpdate({
		_id: geoID,
	}, {
		$addToSet: {
			'properties.ratingIDs': ratingID,
		},
	}, {
		new: true,
	});

const saveAndUpdateRefs = async (userID, geoID, comment, username, averageRating, rating, isPersonalExperience, timeline, userEmail, activeRatings) => {
	const commentSaved = comment ? await saveComment(comment, userID, geoID, username, averageRating) : null;
	const commentID = commentSaved ? commentSaved._id : null;

	const ratingSaved = await saveRating(userID, commentID, geoID, rating, averageRating, isPersonalExperience, timeline);
	const ratingID = ratingSaved._id;

	const userResult = await addGeoToUser(userEmail, ratingID, geoID, activeRatings);
	const geoUpdatedSecondTime = await addRatingRefToGeo(geoID, ratingID);
};

exports.geo_add = async (req, res, next) => {
	const { body } = req;

	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const userEmail = sanitize(req.session.userID);
	body.location.coordinates = [ body.location.coordinates[1], body.location.coordinates[0] ];

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user)
			return res.status(400).json({ error: "User is not found" });

		if (user.usergroup !== 0 && (user.properties.activeRatings <= 0 || !user.properties.activeRatings))
			return res.status(400).json({ error: "No actions remaining" });

		const geo = await Geo.findOne({
			"location": {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [ ...body.location.coordinates ],
					},
					$maxDistance: 400,
				},
			},
		});

		const { properties } = body;
		const { rating, averageRating, comment, isPersonalExperience, timeline } = properties;
		const activeRatings = user.usergroup === 0 ? 99 : user.properties.activeRatings;
		const userID = user._id;
		if (geo) {
			// check if user rated it already
			const id = geo._id;
			const exists = user.properties.geoIDs.some(val => val.equals(id));
			if (exists)
				return res.status(400).json({ error: "Nearby place is already rated" });
			// update
			const oldProps = geo.properties;
			const newRating = getNewRating(oldProps.rating, oldProps.numberOfUsers, rating);
			const { finalRating } = getFinalRating(newRating);
			const numberOfUsers = oldProps.numberOfUsers + 1;
			const numberOfComments = comment !== null ? oldProps.numberOfComments + 1 : oldProps.numberOfComments;
			const numberOfPersonalExperience = isPersonalExperience ? oldProps.numberOfPersonalExperience + 1 : oldProps.numberOfPersonalExperience;

			try {
				const geoUpdated = await Geo.findOneAndUpdate({
					_id: geo._id,
				}, {
					$set: {
						properties: {
							ratingIDs: geo.properties.ratingIDs,
							rating: newRating,
							averageRating: finalRating,
							numberOfComments,
							numberOfPersonalExperience,
							numberOfUsers,
						},
					},
				}, {
					new: true,
				});
				await saveAndUpdateRefs(userID, geoUpdated._id, comment, user.username, averageRating, rating, isPersonalExperience, timeline, userEmail, activeRatings);

				return res.json({
					error: null,
					data: {
						message: "Rating updated",
						coords: geoUpdated.location.coordinates,
						averageRating: geoUpdated.properties.averageRating,
					},
				});
			} catch (e) {
				console.log(e);
				Sentry.captureException(e);
				return res.status(400).json({ error: "Could not save your rating" });
			}
		} else {
			// create
			try {
				const geoSaved = await new Geo({
					properties: {
						rating,
						averageRating,
						numberOfComments: comment ? 1 : 0,
						numberOfPersonalExperience: isPersonalExperience ? 1 : 0,
						numberOfUsers: 1,
					},
					location: body.location,
				}).save();
				await saveAndUpdateRefs(userID, geoSaved._id, comment, user.username, averageRating, rating, isPersonalExperience, timeline, userEmail, activeRatings);

				return res.json({
					error: null,
					data: {
						message: "Rating added",
					},
				});
			} catch (e) {
				console.log(e);
				Sentry.captureException(e);
				return res.status(400).json({ error: "Could not save your rating" });
			}
		}
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.geo_location = async (req, res, next) => {
	const userID = sanitize(req.session.userID);

	const urlParams = new URLSearchParams(req.params.coords);
	const nearCoords = Object.fromEntries(urlParams);
	const arr = nearCoords.latlng.split(',').map(Number);
	try {
		const result = await Geo.findOne({
			"location": {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [ ...arr ],
					},
					$maxDistance: 50,
				},
			},
		}, '-location');

		if (!result)
			return res.status(400).json({ error: 'Location not found' });

		const geoID = result._id;
		const user = userID ? await User.findOne({ $and: [
			{ email: userID },
			{ 'properties.geoIDs': {
				$in: [ geoID ],
			} },
		] }) : null;

		const { properties } = result;
		const { ratingIDs } = properties;

		const timeline = await Rating.find({
			'_id': { $in: ratingIDs },
		}, 'timeline averageRating');

		const props = {
			...properties,
			isRated: user ? true : false,
			timeline,
			geoID,
		};

		delete props['ratingIDs'];

		return res.json({
			error: null,
			data: {
				message: "Geolocation found",
				userID: userID ? userID : null,
				properties: props,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.geo_location_nearby = async (req, res, next) => {
	const { userID } = req.session;
	const urlParams = new URLSearchParams(req.params.coords);
	const { coords, radius } = Object.fromEntries(urlParams);
	const arr = coords.split(',').map(Number).reverse();

	try {
		const geos = await Geo.find(
			{
				"location": {
					$geoWithin: {
						$centerSphere: [[ ...arr ], radius ],
					},
				},
			},
			'properties.ratingIDs',
		);

		const pois = await PointOfInterest.find(
			{
				"location": {
					$geoWithin: {
						$centerSphere: [[ ...arr ], radius ],
					},
				},
			},
			'title location tags -_id',
		);

		const ratingIDs = geos.map(geo => geo.properties.ratingIDs).flat();

		const ratings = await Rating.find(
			{
				_id : {
					$in : [ ...ratingIDs ],
				},
			},
			'rating reported timeline -_id',
		);

		return res.json({
			error: null,
			data: {
				message: "Nearby locations found",
				userID: userID ? userID : null,
				ratings,
				pois,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.geo_comments = async (req, res, next) => {
	const userEmail = sanitize(req.session.userID);

	const urlParams = new URLSearchParams(req.params.geoID);
	const { geoID } = Object.fromEntries(urlParams);

	try {
		const comments = await Comment.find({ "geo": sanitize(geoID) });
		const user = await User.findOne({ email: userEmail });
		const userID = user ? user._id : 'anon';

		const arrayToSend = comments.map(item => ({
			isYours: user ? (userID.equals(item.user) ? true : false) : false,
			isLiked: user ? item.likes.some(item => item.equals(userID)) : false,
			isDisliked: user ? item.dislikes.some(item => item.equals(userID)) : false,
			rating: item.rating,
			comment: item.comment,
			username: item.username,
			liked: item.likes.length,
			disliked: item.dislikes.length,
			id: item._id,
		}));

		return res.json({
			error: null,
			data: {
				message: "Comments fetched",
				userID: userID ? userID : null,
				array: arrayToSend,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.rating_get = async (req, res, next) => {
	const userEmail = sanitize(req.session.userID);

	const urlParams = new URLSearchParams(req.params.ratingID);
	const { ratingID } = Object.fromEntries(urlParams);

	try {
		const rating = await Rating.findOne({ "_id": sanitize(ratingID) });
		const user = await User.findOne({ email: userEmail });
		const userID = user ? user._id : 'anon';

		const ratingData = {
			isYours: user ? (userID.equals(rating.userID) ? true : false) : false,
			isReported: user ? rating.reported.some(item => item.equals(userID)) : false,
			isEndorsed: user ? rating.endorsed.some(item => item.equals(userID)) : false,
			rating: rating.rating,
			isPersonalExperience: rating.isPersonalExperience,
		};

		return res.json({
			error: null,
			data: {
				message: "Ratings fetched",
				userID: userEmail ? userEmail : null,
				ratingData,
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.rating_react = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const email = sanitize(req.session.userID);
	const { ratingID, shouldReport } = req.body;
	const property = shouldReport ? 'reported' : 'endorsed';

	try {
		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({ error: "User not found" });

		const userID = user._id;
		const result = await Rating.findOneAndUpdate({
			_id: sanitize(ratingID),
		}, {
			$addToSet: {
				[property]: userID,
			},
		}, {
			new: true,
		});

		await updateKarma(user._id, result.userID, shouldReport);

		return res.json({
			error: null,
			data: {
				message: "Reaction successful",
				userID: user.email,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.geo_react_comment = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const email = sanitize(req.session.userID);
	const { key, goal } = req.body;
	const property = goal === 'like' ? 'likes' : 'dislikes';
	const propertyOpp = goal === 'like' ? 'dislikes' : 'likes';

	try {
		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({ error: "User not found" });

		const userID = user._id;
		const result = await Comment.findOneAndUpdate({
			_id: sanitize(key),
		}, {
			$addToSet: {
				[property]: userID,
			},
		}, {
			new: true,
		});

		const resultRemove = await Comment.findOneAndUpdate({
			_id: sanitize(key),
		}, {
			$pull: {
				[propertyOpp]: userID,
			},
		}, {
			new: true,
		});

		await updateKarma(userID, result.user, goal !== 'like');

		return res.json({
			error: null,
			data: {
				message: "Reaction successful",
				userID: user.email,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.geo_location_by_bounds = async (req, res, next) => {
	const { userID } = req.session;
	const urlParams = new URLSearchParams(req.params.coords);
	const { bounds, zoom, filters } = Object.fromEntries(urlParams);
	const polygon = JSON.parse(bounds);
	const filtersObj = filters ? JSON.parse(filters) : null;

	const arrOfFilters = filtersObj ? Object.entries(filtersObj).map(([ key, value ]) => {
		const [ gte, lte ] = value.split('-');
		const keyName = `properties.rating.${key}`;
		return { [keyName]: { $gte : Number(gte), $lte : Number(lte) } };
	}) : null;

	try {
		const result = filtersObj
			? await Geo.find(
				{
					"location": {
						$geoWithin: {
							$polygon: polygon,
						},
					},
					"$and": arrOfFilters,
				},
				'location.coordinates properties.averageRating',
			)
			: await Geo.find(
				{
					"location": {
						$geoWithin: {
							$polygon: polygon,
						},
					},
				},
				'location.coordinates properties.averageRating',
			);

		return res.json({
			error: null,
			data: {
				message: "Location fetched",
				userID: userID ? userID : null,
				result,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
