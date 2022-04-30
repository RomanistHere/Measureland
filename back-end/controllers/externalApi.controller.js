require('dotenv').config();
const deepl = require('deepl-node');
const Sentry = require('@sentry/node');

const authKeyDeepL = process.env.DEEPL_KEY;
const apiOWMKey = process.env.OPENWEATHERMAP_KEY;
const locationIqKey = process.env.LOCATIONIQ_KEY;
const translator = new deepl.Translator(authKeyDeepL);

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

exports.getOpenWeatherAirPollution = async (req, res) => {
	const urlParams = new URLSearchParams(req.params.params);
	const { lat, lng, start, end } = Object.fromEntries(urlParams);

	try {
		const histData = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lng}&start=${start}&end=${end}&appid=${apiOWMKey}`);
		const histDataParsed = await histData.json();
		const sum = histDataParsed.list.reduce((a, item) => a + item.main.aqi, 0);
		// 1 - good, 5 - bad
		const averageAirPollution = Math.round(sum / histDataParsed.list.length);
		// convert to 1 - bad, 5 good
		const airPollutionIndex = [ 5, 4, 3, 2, 1 ][averageAirPollution - 1];

		return res.json({
			error: null,
			data: {
				airPollutionIndex,
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};

exports.getLocationIqAddress = async (req, res) => {
	const urlParams = new URLSearchParams(req.params.params);
	const { lat, lng, lang } = Object.fromEntries(urlParams);

	try {
		const geoCoding = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${locationIqKey}&lat=${lat}&lon=${lng}&format=json&accept-language=${lang}`);
		const { address } = await geoCoding.json();

		return res.json({
			error: null,
			data: {
				address,
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
