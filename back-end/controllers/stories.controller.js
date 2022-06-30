const Sentry = require("@sentry/node");

const stories = [{
	title: "test1",
	content: "test1 content",
	author: "",
	coords: [ 27.3, 53.9 ],
	uniqID: "1",
	isEdited: false,
}, {
	title: "test2",
	content: "test2 content",
	author: "",
	coords: [ 27.4, 53.9 ],
	uniqID: "2",
	isEdited: false,
}, {
	title: "test3",
	content: "test3 content",
	author: "",
	coords: [ 27.5, 53.9 ],
	uniqID: "3",
	isEdited: false,
}, {
	title: "test4",
	content: "test4 content",
	author: "",
	coords: [ 27.6, 53.9 ],
	uniqID: "4",
	isEdited: false,
}];

exports.getAllStories = async (req, res, next) => {
	const { userID } = req.session;

	try {
		const result = stories.map(({ title, coords }) => ({ title, coords }));

		return res.json({
			error: null,
			data: {
				message: "Stories fetched",
				userID: userID ? userID : null,
				result,
			},
		});
	} catch (error) {
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.getFullStory = async (req, res, next) => {
	const { userID } = req.session;
	const id = 1;

	try {
		const result = stories.find(item => item.uniqID === id);

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
