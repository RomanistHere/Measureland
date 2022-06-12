require('dotenv').config();
const deepl = require('deepl-node');
const Sentry = require('@sentry/node');
const sanitize = require("mongo-sanitize");
const crypto = require('node:crypto');

const authKeyDeepL = process.env.DEEPL_KEY;
const apiOWMKey = process.env.OPENWEATHERMAP_KEY;
const locationIqKey = process.env.LOCATIONIQ_KEY;
const locationIqKeyBckp = process.env.LOCATIONIQ_KEY_BCKP;
const telegramBotToken = process.env.TG_BOT_TOKEN;
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
		const histData = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${sanitize(lat)}&lon=${sanitize(lng)}&start=${sanitize(start)}&end=${sanitize(end)}&appid=${apiOWMKey}`);
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
	const snLat = sanitize(lat);
	const snLng = sanitize(lng);
	const snLang = sanitize(lang);

	try {
		const geoCoding = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${locationIqKey}&lat=${snLat}&lon=${snLng}&format=json&accept-language=${snLang}`);
		const { address } = await geoCoding.json();

		return res.json({
			error: null,
			data: {
				address,
			},
		});
	} catch (e) {
		try {
			// if quota 5K requests per day fail, use as a fallback
			const geoCoding = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${locationIqKeyBckp}&lat=${snLat}&lon=${snLng}&format=json&accept-language=${snLang}`);
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
	}
};

const checkSignature = ({ hash, ...userData }) => {
	// create a hash of a secret that both you and Telegram know. In this case, it is your bot token
	const secretKey = crypto.createHash('sha256')
		.update(telegramBotToken)
		.digest();

	// this is the data to be authenticated i.e. telegram user id, first_name, last_name etc.
	const dataCheckString = Object.keys(userData)
		.sort()
		.map(key => (`${key}=${userData[key]}`))
		.join('\n');

	// run a cryptographic hash function over the data to be authenticated and the secret
	const hmac = crypto.createHmac('sha256', secretKey)
		.update(dataCheckString)
		.digest('hex');

	// compare the hash that you calculate on your side (hmac) with what Telegram sends you (hash) and return the result
	return hmac === hash;
};

exports.checkTelegramLogin = async (req, res) => {
	const urlParams = new URLSearchParams(req.params.params);
	const data = Object.fromEntries(urlParams);

	try {
		return res.json({
			error: null,
			data: {
				isFromTg: checkSignature(data),
			},
		});
	} catch (error) {
		console.log(error);
		Sentry.captureException(error);
		return res.status(400).json({ error });
	}
};
