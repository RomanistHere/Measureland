const sanitize = require('mongo-sanitize');
const Sentry = require('@sentry/node');

const PointOfInterest = require('../models/point-of-interest.model');
const User = require('../models/user.model');
const Comment = require("../models/comment.model");

exports.POI_add = async(req, res, next) => {
	const { body } = req;

	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const userEmail = sanitize(req.session.userID);

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user)
			return res.status(400).json({ error: "User is not found" });

		if (user.usergroup !== 0 && (user.properties.activeRatings <= 0 || !user.properties.activeRatings))
			return res.status(400).json({ error: "No active ratings" });

		const pointOfInterest = await PointOfInterest.findOne({
			"location": {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [ ...body.location.coordinates ],
					},
					$maxDistance: 100,
				},
			},
		});

		const { properties } = body;
		const { title, description, tags } = properties;
		const activeRatings = user.usergroup === 0 ? 99 : user.properties.activeRatings;
		const userID = user._id;

		if (pointOfInterest) {
			return res.status(400).json({ error: "Too close to existing Point of interest." });
		}

		try {
			const pointSaved = await new PointOfInterest({
				userID,
				title,
				description,
				tags,
				location: body.location,
				likes: [],
				dislikes: [],
			}).save();

			await User.findOneAndUpdate({
				email: userEmail,
			}, {
				$addToSet: {
					'properties.POIIDs': pointSaved._id,
				},
				$set: {
					'properties.activeRatings': activeRatings - 1,
				},
			}, {
				new: true,
			});

			return res.json({
				error: null,
				data: {
					message: "POI added",
				},
			});
		} catch (e) {
			console.log(e);
			Sentry.captureException(e);
			return res.status(400).json({ error: "Could not save your Point of interest" });
		}
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.POI_get_by_bounds = async(req, res, next) => {
	const { userID } = req.session;
	const urlParams = new URLSearchParams(req.params.coords);
	const { bounds, zoom } = Object.fromEntries(urlParams);
	const polygon = JSON.parse(bounds);

	try {
		const result = await PointOfInterest.find(
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
				message: "POI locations fetched",
				userID: userID ? userID : null,
				result,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

const getRelations = async (userID, POIID, likes, dislikes) => {
	if (!userID)
		return { isYourPOI: null, isLiked: null, isDisliked: null };

	const { _id, properties } = await User.findOne({ email: userID }, 'properties.POIIDs');
	const { POIIDs } = properties;

	return {
		isYourPOI: POIIDs.some(item => item.equals(POIID)),
		isLiked: likes.some(item => item.equals(_id)),
		isDisliked: dislikes.some(item => item.equals(_id)),
	};
};

exports.POI_get_single = async(req, res, next) => {
	const userID = sanitize(req.session.userID);

	const urlParams = new URLSearchParams(req.params.coords);
	const nearCoords = Object.fromEntries(urlParams);
	const arr = nearCoords.latlng.split(',').map(Number);
	try {
		const result = await PointOfInterest.findOne({
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
			return res.status(400).json({ error: 'Point of interest not found' });

		const { title, description, tags, likes, dislikes, _id } = result;
		const { isYourPOI, isLiked, isDisliked } = await getRelations(userID, result._id, likes, dislikes);

		return res.json({
			error: null,
			data: {
				message: "Point of interest found",
				userID: userID ? userID : null,
				properties: {
					title,
					description,
					tags,
					isYourPOI,
					isLiked,
					isDisliked,
					pointID: _id,
					likes: likes.length,
					dislikes: dislikes.length,
				},
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.POI_react = async(req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const email = sanitize(req.session.userID);
	const { pointID, isUpvote } = req.body;
	const property = isUpvote ? 'likes' : 'dislikes';
	const propertyOpp = isUpvote ? 'dislikes' : 'likes';

	try {
		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({ error: "User not found" });

		const userID = user._id;
		const result = await PointOfInterest.findOneAndUpdate({
			_id: sanitize(pointID),
		}, {
			$addToSet: {
				[property]: userID,
			},
		}, {
			new: true,
		});

		const resultRemove = await PointOfInterest.findOneAndUpdate({
			_id: sanitize(pointID),
		}, {
			$pull: {
				[propertyOpp]: userID,
			},
		}, {
			new: true,
		});

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
