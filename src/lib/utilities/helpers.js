import { get } from "svelte/store";

import { circle } from "@turf/turf";

import { overlayStateStore, appStateStore, notificationsStore, filtersStore, flowStore } from "../../stores/state.js";
import { overlayStateDefault } from "../constants/overlayStateDefault.js";
import { flowDictionary } from "../../configs/flow.js";

const debounce = (func, wait, immediate) => {
	let timeout;
	return function () {
		const context = this; const args = arguments;
		const later = function () {
			timeout = null;
			if (!immediate)
				func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow)
			func.apply(context, args);
	};
};

const logError = error => {
	// eslint-disable-next-line no-console
	console.warn(error);
};

const convertMetersToRadian = meters =>
	meters / 6378100;

const sleep = milliseconds =>
	new Promise(resolve => setTimeout(resolve, milliseconds));

const getAverageRating = array =>
	array.reduce((acc, c) => acc + c.options.rating, 0) / array.length;

const splitString = (str, key) =>
	str.split(key);

const roundToFifthDecimal = number =>
	Math.round(10000 * number) / 10000;

const roundToFifthDecimalLatLng = ({ lat, lng }) =>
	({ lat: roundToFifthDecimal(lat), lng: roundToFifthDecimal(lng) });

const roundToTen = number =>
	Math.round(10 * number) / 10;

const roundToHundredth = number =>
	Math.round(100 * number) / 100;

const roundToInt = number =>
	Math.round(number);

const getColor = rating => {
	if (rating >= 4) {
		return "green";
	} else if (rating >= 3) {
		return "yellow";
	} else {
		return "red";
	}
};

const additionalProps = [ "pets", "kids", "parking" ];

const checkAdditionalProp = prop =>
	additionalProps.some(item => prop === item);

const getFinalRating = obj => {
	const keys = Object.keys(obj);
	let mainAsnwersCounter = 0;
	let additionalAsnwersCounter = 0;
	let sumMain = 0;
	let sumAdditional = 0;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const val = obj[key];

		if (val === null)
			continue;

		// check what value the property is going to have. Distribution is 75% for main props and 25 for additional ones
		const isAdditionalProp = checkAdditionalProp(key);
		if (isAdditionalProp) {
			sumAdditional = sumAdditional + val;
			additionalAsnwersCounter++;
		} else {
			sumMain = sumMain + val;
			mainAsnwersCounter++;
		}
	}

	const mainPart = mainAsnwersCounter !== 0
		? sumMain / mainAsnwersCounter
		: 0; // 75%
	const additionalPart = additionalAsnwersCounter !== 0
		? sumAdditional / additionalAsnwersCounter
		: 0; // 25%
	const finalRating = additionalPart !== 0
		? (mainPart * 3 + additionalPart) / 4
		: mainPart; // if no additional ratings

	return {
		answersNumber: mainAsnwersCounter + additionalAsnwersCounter,
		finalRating,
	};
};

const registerAction = action =>
	flowStore.update(actions => ([ ...actions, flowDictionary[action] ]));

const closeOverlaysWithSameType = (overlayType, state) => {
	let isModalOpen = false;

	const keysArray = Object.keys(state);
	const length = keysArray.length;

	for (let i = 0; i < length; i++) {
		const { type, isOpen } = state[keysArray[i]];
		if (overlayType === type && isOpen) {
			// mutation here should be faster and has no consequences
			state[keysArray[i]].isOpen = false;
		} else {
			// check if any of other modals are open
			// eslint-disable-next-line no-lonely-if
			if (isOpen)
				isModalOpen = true;
		}
	}

	return {
		newState: state,
		isModalOpen,
	};
};

const openAnotherOverlay = (overlayName = null, data = {}) => {
	try {
		overlayStateStore.update(state => {
	        const overlayType = state[overlayName]["type"];
	        const { newState } = closeOverlaysWithSameType(overlayType, state);
	        return ({ ...newState, [overlayName]: { ...newState[overlayName], isOpen: true, data } });
	    });
		registerAction(overlayName);
	} catch (e) {
		logError(e);
		logError("Suggested solution: define popup in constants/overlayStateDefault.js");
	}
};

const closeOverlay = (overlayType = null) => {
	if (overlayType) {
		overlayStateStore.update(state => {
			const { newState, isModalOpen } = closeOverlaysWithSameType(overlayType, state);

			if (!isModalOpen)
				appStateStore.update(appState => ({ ...appState, openModal: false }));

			return ({ ...newState });
		});
		registerAction(`cl-${overlayType}`);
	} else {
		overlayStateStore.update(() => overlayStateDefault);
		appStateStore.update(state => ({ ...state, openModal: false }));
		registerAction("cl");
	}
};

const closeOverlays = () => closeOverlay();

const showSuccessNotification = () =>
	notificationsStore.update(state => ({ ...state, successNotification: true }));

const showSomethingWrongNotification = () =>
	notificationsStore.update(state => ({ ...state, somethingWrongNotification: true }));

const hideSomethingWrongNotification = () =>
	notificationsStore.update(state => ({ ...state, somethingWrongNotification: false }));

const objToString = object => {
	let str = "";
	for (const k in object) {
		// eslint-disable-next-line no-prototype-builtins
		if (object.hasOwnProperty(k)) {
			str = `${str}${k}:${object[k]},`;
		}
	}
	return str.slice(0, -1);
};

const fillFiltersFromArrOfStrings = (arrOfStrings, refs = null) => {
	let obj;

	// probably refactor to something less complicated
	for (let k = 0; k < arrOfStrings.length; k++) {
		const string = arrOfStrings[k];
		const [ key, valString ] = string.split(":");
		const values = valString.split("-");
		const rangeArr = [ Number(values[0]), Number(values[1]) ];
		obj = {
			...obj,
			[key]: valString,
		};

		// if we didn't need obj, loop over refs would give more performance
		if (!refs)
			continue;

		for (let i = 0; i < refs.length; i++) {
			const refObj = refs[i];

			if (refObj.key === key)
				refObj.ref.setSlider(rangeArr);
		}
	}

	filtersStore.update(state => ({
		...state,
		isFiltersOn: true,
		filters: { ...obj },
	}));
};

const setCookie = (cname, cvalue, exdays) => {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	const expires = `expires=${d.toUTCString()}`;
	document.cookie = `${cname}=${cvalue};${expires};path=/`;
};

const getCookie = cname => {
	const name = `${cname}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		// eslint-disable-next-line eqeqeq
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		// eslint-disable-next-line eqeqeq
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
};

const drawCircle = ({ map, lng, lat, radius }) => {
	if (!map)
		return;

	const circleObj = circle([ lng, lat ], radius, { steps: 50, unites: "kilometers" });

	map.addSource("highlightedArea", {
		type: "geojson",
		data: circleObj,
	});

	map.addLayer({
		id: "highlighted-area",
		type: "fill",
		source: "highlightedArea",
		paint: {
			"fill-outline-color": "#007097",
			"fill-color": "rgba(56, 119, 241, .16)",
		},
	});
};

const removeCircle = ({ map, id = "highlighted-area", source = "highlightedArea" }) => {
	map.removeLayer(id);
	map.removeSource(source);
};

const centerMap = (map, lat, lng, isDesktop = true, zoomClosely = false, zoomLevel = null) => {
	if (!map)
		return;

	const bounds = map.getBounds();
	const east = roundToFifthDecimal(bounds.getEast());
	const west = roundToFifthDecimal(bounds.getWest());
	const distanceBetweenEdgesOfScreen = roundToFifthDecimal(Math.abs(east - west));
	const currentZoom = map.getZoom();

	/* eslint-disable no-nested-ternary */
	// doesn't look better with if/else syntax
	const zoom = zoomLevel && currentZoom >= zoomLevel
		? zoomLevel
		: zoomClosely
			? currentZoom <= 14 ? 15 : currentZoom
			: currentZoom <= 12 ? 13 : currentZoom;
	/* eslint-enable no-nested-ternary */

	// center in left half of the screen for desktop
	map.setView({
		lng: isDesktop ? lng + distanceBetweenEdgesOfScreen / (4 * map.getZoomScale(zoom)) : lng,
		lat,
	}, zoom);
};

const generateYearsBetween = (startYear, endYear) => {
	let startDate = startYear;
	const endDate = endYear || new Date().getFullYear();
	const years = [];
	for (let i = startDate; i <= endDate; i++) {
		years.push(startDate);
		startDate++;
	}
	return years;
};

const blurCurrentInput = document => {
	if (document)
		document.activeElement.blur();
};

const errorObj = {
	"Already verified": "alreadyVerified",
	"Email already exists": "accountExists",
	"Email is wrong": "noAccount",
	"Invalid csrf token": "invalidCsrfToken",
	"Matches old password": "samePass",
	"Nearby place is already rated": "nearbyPlaceAlreadyRated",
	"No actions remaining": "youRateTooOften",
	"Password is wrong": "wrongPassword",
	"Password link is invalid or expired": "linkExpired",
	"Too many requests, please try again later": "manyRequests",
	"User is not logged in": "sessionExpired",
	"User is not verified": "verificationLetter",
};

const getErrorType = error => {
	const errorFromObj = errorObj[error];
	flowStore.update(actions => ([ ...actions, errorFromObj ]));
	return errorFromObj ? errorFromObj : "unrecognizedError";
};

const getMapZoom = map => map.getZoom();

const getBoundsData = map => {
	const bounds = map.getBounds();
	const zoom = getMapZoom(map);
	const center = roundToFifthDecimalLatLng(bounds.getCenter());
	const east = roundToFifthDecimal(bounds.getEast());
	const north = roundToFifthDecimal(bounds.getNorth());
	const west = roundToFifthDecimal(bounds.getWest());
	const south = roundToFifthDecimal(bounds.getSouth());

	return {
		zoom,
		center,
		east,
		north,
		west,
		south,
	};
};

const getScreenData = map => {
	const { zoom, center, east, north, south, west } = getBoundsData(map);

	const currentScreenPoly = {
		regions: [
			[[ north, west ], [ north, east ], [ south, east ], [ south, west ]],
		],
		inverted: false,
	};

	return {
		zoom,
		center,
		east,
		north,
		west,
		south,
		currentScreenPoly,
	};
};

const truncateString = (string, limit) => {
	if (string.length > limit) {
		return `${string.substring(0, limit)}...`;
	} else {
		return string;
	}
};

const getCopyrightYears = () => {
	const startYear = 2021;
	const currentYear = new Date().getFullYear();
	return currentYear === startYear ? currentYear : `${startYear}-${currentYear}`;
};

const detectLanguage = async text => {
	const { francAll } = await import("franc-min");

	const possibleLanguages = francAll(text);
	let highlyPossibleLanguages = [];
	for (let i = 0; i < possibleLanguages.length; i++) {
		const [ lang, possibility ] = possibleLanguages[i];
		if (possibility > 0.9)
			highlyPossibleLanguages = [ ...highlyPossibleLanguages, lang ];
	}

	return highlyPossibleLanguages;
};

const langTransp = {
	"ru": "rus",
	"en": "eng",
};

const shouldTranslate = async (text, currentLang) => {
	const possibleLanguages = await detectLanguage(text);
	return possibleLanguages.includes(langTransp[currentLang]);
};

const getOpenedOverlay = () => {
	const overlaysObj = get(overlayStateStore);
	const overlayData = Object.entries(overlaysObj).find(([ key, value ]) => value.isOpen);
	if (overlayData) {
		const [ overlay, data ] = overlayData;
		return {
			overlay,
			data,
		};
	} else {
		return {
			overlay: null,
			data: null,
		};
	}
};

const removeBigNumberValuesInJsonValues = json =>
	JSON.stringify(json, (key, val) => {
		if (val && typeof val === "number") {
			return val.toFixed ? Number(val.toFixed(2)) : val;
		}

		return val;
	});

const generateRandomString = () =>
	Math.random().toString(16).slice(2);

const pipe = (...fns) =>
	x => fns.reduce((v, f) => f(v), x);

// not currently used
const compose = (...fns) =>
	x => fns.reduceRight((v, f) => f(v), x);

const removeDuplicatesById = arr =>
	arr.filter((v, i, a) => a.findIndex(v2 => (v2._id === v._id)) === i);

const prepareStringToNotBreak = str =>
	str.split(" ").join("\u00A0").split("-").join("\u2011");

export {
	debounce,
	sleep,
	getAverageRating,
	splitString,
	roundToFifthDecimal,
	roundToFifthDecimalLatLng,
	roundToTen,
	roundToHundredth,
	roundToInt,
	getColor,
	getFinalRating,
	openAnotherOverlay,
	closeOverlay,
	closeOverlays,
	showSuccessNotification,
	showSomethingWrongNotification,
	hideSomethingWrongNotification,
	objToString,
	fillFiltersFromArrOfStrings,
	setCookie,
	getCookie,
	drawCircle,
	removeCircle,
	centerMap,
	registerAction,
	generateYearsBetween,
	logError,
	convertMetersToRadian,
	getMapZoom,
	getBoundsData,
	getScreenData,
	blurCurrentInput,
	getErrorType,
	truncateString,
	getCopyrightYears,
	shouldTranslate,
	getOpenedOverlay,
	generateRandomString,
	removeBigNumberValuesInJsonValues,
	pipe,
};
