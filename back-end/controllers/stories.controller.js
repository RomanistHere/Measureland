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
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.getFullStory = async (req, res, next) => {
	const userid = sanitize(req.session.userID);
	const urlParams = new URLSearchParams(req.params.ratingID);
	const { storyId } = Object.fromEntries(urlParams);

	try {
		const story = await Story.findOne({ "_id": sanitize(storyId) }, "-location -_id");

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
