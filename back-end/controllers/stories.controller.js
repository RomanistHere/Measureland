const Sentry = require("@sentry/node");
const Story = require('../models/story.model');

exports.getAllStories = async (req, res, next) => {
	try {
		const result = await Story.find({});

		console.log(result);

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
	// const { userID } = req.session;
	// const id = 1;
	//
	// try {
	// 	const result = stories.find(item => item.uniqID === id);
	//
	// 	return res.json({
	// 		error: null,
	// 		data: {
	// 			message: "Location fetched",
	// 			userID: userID ? userID : null,
	// 			result,
	// 		},
	// 	});
	// } catch (error) {
	// 	Sentry.captureException(error);
	// 	return res.status(400).json({ error });
	// }
};
