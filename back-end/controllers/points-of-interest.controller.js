const sanitize = require('mongo-sanitize');
const Sentry = require('@sentry/node');

const PointOfInterest = require('../models/point-of-interest.model');
const User = require('../models/user.model');

exports.POI_add = async(req, res, next) => {
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