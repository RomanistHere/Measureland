require('dotenv').config();
const deepl = require('deepl-node');
const Sentry = require('@sentry/node');

const authKey = process.env.DEEPL_KEY;
const translator = new deepl.Translator(authKey);

exports.translateText = async (req, res) => {
	const { text, lang } = req.body;

	try {
		const translation = await translator.translateText(text, null, lang);

		return res.json({
			error: null,
			data: {
				translation,
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
