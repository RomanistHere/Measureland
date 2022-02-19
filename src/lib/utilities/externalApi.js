import { logError } from "$lib/utilities/helpers.js";

const getaverageWAQI = aqiVal => {
	// based on https://waqi.info/
	if (aqiVal < 50) {
		return 5;
	} else if (aqiVal < 100) {
		return 4;
	} else if (aqiVal < 150) {
		return 3;
	} else if (aqiVal < 200) {
		return 2;
	} else {
		return 1;
	}
};

const getDisasterRisk = riskValue => {
	// based on https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk
	if (riskValue < 3.37) {
		return 5;
	} else if (riskValue < 5.5) {
		return 4;
	} else if (riskValue < 7.12) {
		return 3;
	} else if (riskValue < 10.3) {
		return 2;
	} else {
		return 1;
	}
};

const fetchDisasterRisk = async country => {
	const wikiParams = new URLSearchParams({
		origin: "*",
		action: "parse",
		page: "List_of_countries_by_natural_disaster_risk",
		format: "json",
		section: "3",
	});
	const wikiUrl = `https://en.wikipedia.org/w/api.php?${wikiParams}`;

	try {
		const req = await fetch(wikiUrl);
		const json = await req.json();
		const text = json.parse.text["*"];
		const foundCountry = text.split(`title="${country}">${country}</a>`)[1];
		const extractedNumber = parseFloat(foundCountry.match(/[\d\\.]+/));
		return getDisasterRisk(extractedNumber);
	} catch (e) {
		logError('Api load failed');
		logError(e);
		return 'unavailable';
	}
};

const fetchWaqi = async (lat, lng) => {
	// todo: reset and move somewhere else
	const apiWaqiKey = 'dae93ad4b135f627cf146b641b1820ab0395d9c8';
	try {
		const data = await fetch(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiWaqiKey}`);
		const parsedData = await data.json();
		const aqi = parsedData.data.aqi;
		return getaverageWAQI(aqi);
	} catch (e) {
		logError('Api load failed');
		logError(e);
		return 'unavailable';
	}
};

const fetchOpenWeather = async (lat, lng) => {
	// todo: probably simplify, we need to get previous year in UNIX
	const prevYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
	const prevYearUnix = Math.floor(prevYear.getTime() / 1000);
	// todo: reset and move somewhere else
	const apiOWMKey = '1387a4c3445d5f7c3e3d3793eb75cb53';
	try {
		const histData = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lng}&start=${prevYearUnix}&end=${Date.now()}&appid=${apiOWMKey}`);
		const histDataParsed = await histData.json();
		const sum = histDataParsed.list.reduce((a, item) => a + item.main.aqi, 0);
		// 1 - good, 5 - bad
		const averageAirPollution = Math.round(sum / histDataParsed.list.length);
		// convert to 1 - bad, 5 good
		return [ 5, 4, 3, 2, 1 ][averageAirPollution - 1];
	} catch (e) {
		logError('Api load failed');
		logError(e);
		return 'unavailable';
	}
};

export {
	fetchDisasterRisk,
	fetchWaqi,
	fetchOpenWeather,
};