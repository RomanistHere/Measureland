import { fetchFunction } from "./api.js";
import { API_URL } from "../../configs/env.js";
import { showSomethingWrongNotification, logError } from "$lib/utilities/helpers.js";

const mapboxToken = "pk.eyJ1Ijoicm9tYW5pc3RoZXJlIiwiYSI6ImNrc3E2cjYyMTA5eXkyeG5xZXpkcTI0dnUifQ.Bm8W-u4ylJZTzs3sNFu91w";

const translateText = async (text, lang) => {
	const url = `${API_URL}/external/translate_text`;

	// text can be array
	// POST because you can't send array of strings in get - if user uses commas,
	// we won't be able to recognize array items correctly
	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			text,
			lang,
		}),
	});
};

const fetchOpenWeather = async (lat, lng) => {
	// simplify if needed, we need to get previous year in UNIX
	const prevYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
	const start = Math.floor(prevYear.getTime() / 1000);
	const end = Date.now();

	const url = `${API_URL}/external/openweathermap-air_pollution/${new URLSearchParams({ lat, lng, start, end })}`;

	const { error, data } = await fetchFunction({ url });
	if (error) {
		logError(error);
		showSomethingWrongNotification();
		return "unavailable";
	}

	const { airPollutionIndex } = data;
	return airPollutionIndex;
};

const getGeoSuggestions = async text => {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${mapboxToken}`;

	return await fetch(url);
};

const getAddressBackUp = async (lat, lng, lang) => {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&language=${lang}`;

	return await fetch(url);
};

const fetchAddress = async (lat, lng, lang) => {
	const url = `${API_URL}/external/locationiq-address/${new URLSearchParams({ lat, lng, lang })}`;

	const { error, data } = await fetchFunction({ url });

	if (error)
		throw new Error(error);

	const { address } = data;

	if (!address)
		throw new Error("Address fetch failed");

	return address;
};

const getApproximateAddressAndCountry = async (lat, lng, lang) => {
	const regionNamesInEnglish = new Intl.DisplayNames([ "en" ], { type: "region" });

	try {
		const address = await fetchAddress(lat, lng, lang);
		const { road, city, country } = address;

		return {
			address: `${road || ""}, ${address.house_number || ""}. ${city || ""}, ${country || ""}`,
			countryInEnglish: regionNamesInEnglish.of(address.country_code.toUpperCase()),
		};
	} catch (e) {
		logError("Address fetch failed");
		logError(e);
	}

	// if first service is unavailable or limit is reached, try another one
	try {
		const resp = await getAddressBackUp(lat, lng, lang);
		const addressTry2 = await resp.json();

		return {
			address: addressTry2.features[0].place_name,
			countryInEnglish: regionNamesInEnglish.of(addressTry2.features[0].context[3].short_code.toUpperCase()),
		};
	} catch (e) {
		logError("Address fetch from backup failed");
		logError(e);
	}

	return {
		address: null,
		countryInEnglish: null,
	};
};

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
		logError("Api load failed");
		logError(e);
		return "unavailable";
	}
};

const fetchWaqi = async (lat, lng) => {
	// api token is super easy to get, so there is no need to hide it
	// https://aqicn.org/data-platform/token/
	// https://aqicn.org/json-api/doc/
	// https://aqicn.org/api/
	const apiWaqiKey = "dae93ad4b135f627cf146b641b1820ab0395d9c8";
	try {
		const data = await fetch(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiWaqiKey}`);
		const parsedData = await data.json();
		const aqi = parsedData.data.aqi;
		return getaverageWAQI(aqi);
	} catch (e) {
		logError("Api load failed");
		logError(e);
		return "unavailable";
	}
};

export {
	translateText,
	fetchOpenWeather,
	getApproximateAddressAndCountry,
	getGeoSuggestions,
	fetchDisasterRisk,
	fetchWaqi,
};
