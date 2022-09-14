const Sentry = require("@sentry/node");
const Story = require('../models/story.model');
const sanitize = require("mongo-sanitize");
const User = require("../models/user.model");

exports.getAllStories = async (req, res, next) => {
	try {
		const result = await Story.find({}, "slug location title -_id");

		return res.json({
			error: null,
			data: {
				message: "Stories fetched",
				result,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.getFullStory = async (req, res, next) => {
	const userid = sanitize(req.session.userID);
	const urlParams = new URLSearchParams(req.params.storySlug);
	const { storySlug } = Object.fromEntries(urlParams);

	try {
		const story = await Story.findOne({ "slug": sanitize(storySlug) });

		const user = await User.findOne({ _id: userid });
		const userID = user ? user._id : 'anon';

		const result = {
			isLiked: user ? story.likes.some(item => item.equals(userID)) : false,
			isDisliked: user ? story.dislikes.some(item => item.equals(userID)) : false,
			likes: story.likes.length,
			dislikes: story.dislikes.length,
			author: story.author,
			content: story.content,
			title: story.title,
			lngLat: {
				lng: story.location.coordinates[0],
				lat: story.location.coordinates[1],
			},
		};

		return res.json({
			error: null,
			data: {
				message: "Story fetched",
				result,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.reactToStory = async (req, res) => {
	if (!req.session.userID)
		return res.status(400).json({ error: "User is not logged in" });

	const id = sanitize(req.session.userID);
	const { action, storySlug } = req.body;
	const property = action === 'like' ? 'likes' : 'dislikes';
	const propertyOpp = action === 'like' ? 'dislikes' : 'likes';

	try {
		const user = await User.findOne({ _id: id });

		if (!user)
			return res.status(400).json({ error: "User not found" });

		const userID = user._id;
		const result = await Story.findOneAndUpdate({
			slug: sanitize(storySlug),
		}, {
			$addToSet: {
				[property]: userID,
			},
		}, {
			new: true,
		});

		const resultRemove = await Story.findOneAndUpdate({
			slug: sanitize(storySlug),
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
				userID: user._id,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
