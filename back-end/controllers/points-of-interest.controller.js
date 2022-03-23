const sanitize = require('mongo-sanitize');
const Sentry = require('@sentry/node');

const PointOfInterest = require('../models/point-of-interest.model');
const User = require('../models/user.model');
const CommentPOI = require("../models/comment-POI.model");

const { LIMIT_OF_POI_DISLIKES } = require('../config');
const { updateKarma } = require("../helpers/index");

exports.POI_add = async (req, res) => {
	const { body } = req;

	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const userEmail = sanitize(req.session.userID);

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user)
			return res.status(400).json({ error: "User is not found" });

		if (user.usergroup !== 0 && (user.properties.activeRatings <= 0 || !user.properties.activeRatings))
			return res.status(400).json({ error: "No actions remaining" });

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

exports.POI_get_by_bounds = async (req, res) => {
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
			'location.coordinates isAdequate',
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

exports.POI_get_single = async (req, res) => {
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

		const { title, description, tags, likes, dislikes, _id, commentIDs } = result;
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
					comments: commentIDs.length,
				},
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.POI_react = async (req, res) => {
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

		if (resultRemove.dislikes.length > LIMIT_OF_POI_DISLIKES) {
			await PointOfInterest.findOneAndUpdate({
				_id: sanitize(pointID),
			}, {
				isAdequate: false,
			});
		}

		await updateKarma(userID, result.userID, !isUpvote);

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

exports.POI_add_comment = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const userEmail = sanitize(req.session.userID);
	const { pointID, comment, username } = req.body;

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user)
			return res.status(400).json({ error: "User is not found" });

		if (user.usergroup !== 0 && (user.properties.activeRatings <= 0 || !user.properties.activeRatings))
			return res.status(400).json({ error: "No actions remaining" });

		const commentSaved = await new CommentPOI({
			user: user._id,
			point: sanitize(pointID),
			username: sanitize(username),
			comment: sanitize(comment),
		}).save();

		await PointOfInterest.findOneAndUpdate({
			_id: sanitize(pointID),
		}, {
			$addToSet: {
				'commentIDs': commentSaved._id,
			},
		}, {
			new: true,
		});

		await User.findOneAndUpdate({
			email: userEmail,
		}, {
			$addToSet: {
				'properties.POICommentIDs': commentSaved._id,
			},
			$set: {
				'properties.activeRatings': user.properties.activeRatings - 1,
			},
		}, {
			new: true,
		});

		return res.json({
			error: null,
			data: {
				message: "Comment added",
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error: "Could not add a comment" });
	}
};

exports.POI_get_comments = async (req, res) => {
	const userEmail = sanitize(req.session.userID);

	const urlParams = new URLSearchParams(req.params.pointID);
	const { pointID } = Object.fromEntries(urlParams);

	try {
		const comments = await CommentPOI.find({ "point": sanitize(pointID) });
		const user = await User.findOne({ email: userEmail });
		const userID = user ? user._id : 'anon';

		const arrayToSend = comments.map(item => ({
			isYours: user ? (Boolean(userID.equals(item.user))) : false,
			isLiked: user ? item.likes.some(i => i.equals(userID)) : false,
			isDisliked: user ? item.dislikes.some(i => i.equals(userID)) : false,
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

exports.POI_react_comment = async (req, res) => {
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
		const result = await CommentPOI.findOneAndUpdate({
			_id: sanitize(key),
		}, {
			$addToSet: {
				[property]: userID,
			},
		}, {
			new: true,
		});

		const resultRemove = await CommentPOI.findOneAndUpdate({
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

exports.POI_delete = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const urlParams = new URLSearchParams(req.params.pointID);
	const { pointID } = Object.fromEntries(urlParams);

	try {
		const pointRemoved = await PointOfInterest.findOneAndRemove({ _id: sanitize(pointID) });
		const commentsRemoved = await CommentPOI.deleteMany({ _id: { $in: pointRemoved.commentIDs } });

		return res.json({
			error: null,
			data: {
				message: 'Point of Interest deleted',
				coords: pointRemoved.location.coordinates,
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.POI_delete_comment = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const urlParams = new URLSearchParams(req.params.commentID);
	const { commentID } = Object.fromEntries(urlParams);

	try {
		const commentsRemoved = await CommentPOI.findOneAndRemove({ _id: sanitize(commentID) });

		await PointOfInterest.findOneAndUpdate({
			_id: commentsRemoved.point,
		}, {
			$pull: {
				commentIDs: commentID,
			},
		}, {
			new: true,
		});

		return res.json({
			error: null,
			data: {
				message: 'POI comment deleted',
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
