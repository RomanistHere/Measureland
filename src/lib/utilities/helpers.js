import { overlayStateStore, appStateStore, notificationsStore, filtersStore, flowStore } from '../../stores/state.js';
import { overlayStateDefault } from '../constants/overlayStateDefault.js';
import { flowDictionary } from '../../configs/flow.js';

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

const roundToInt = number =>
	Math.round(number);

const getColor = rating => {
	if (rating >= 4) {
		return 'green';
	} else if (rating >= 3) {
		return 'yellow';
	} else {
		return 'red';
	}
};

const additionalProps = [ 'pets', 'kids', 'parking' ];

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
	        const overlayType = state[overlayName]['type'];
	        const { newState } = closeOverlaysWithSameType(overlayType, state);
	        return ({ ...newState, [overlayName]: { ...newState[overlayName], isOpen: true, data } });
	    });
		registerAction(overlayName);
	} catch (e) {
		logError(e);
		logError('Define popup in constants/overlayStateDefault.js');
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
		registerAction(`cl`);
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
	let str = '';
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
		const [ key, valString ] = string.split(':');
		const values = valString.split('-');
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
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		// eslint-disable-next-line eqeqeq
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		// eslint-disable-next-line eqeqeq
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
};

const centerMap = (map, lat, lng, isDesktop = true, zoomClosely = false, zoomLevel = null) => {
	const bounds = map.getBounds();
	const east = roundToFifthDecimal(bounds.getEast());
	const west = roundToFifthDecimal(bounds.getWest());
	const distanceBetweenEdgesOfScreen = roundToFifthDecimal(Math.abs(east - west));
	const currentZoom = map.getZoom();
	const zoom = zoomLevel && currentZoom >= zoomLevel
		? zoomLevel
		: zoomClosely
			? currentZoom <= 14 ? 15 : currentZoom
			: currentZoom <= 12 ? 13 : currentZoom;

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

const blurCurrentInput = () => {
	if (document)
		document.activeElement.blur();
};

const errorObj = {
	'Already verified': 'alreadyVerified',
	'Email already exists': 'accountExists',
	'Email is wrong': 'noAccount',
	'Matches old password': 'samePass',
	'No actions remaining': 'youRateTooOften',
	'Password is wrong': 'wrongPassword',
	'Password link is invalid or expired': 'linkExpired',
	'Too many requests, please try again later': 'manyRequests',
	'User is not logged in': 'sessionExpired',
	'User is not verified': 'verificationLetter',
};

const getErrorType = error => {
	const errorFromObj = errorObj[error];
	return errorFromObj ? errorFromObj : 'unrecognizedError';
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

export {
	debounce,
	sleep,
	getAverageRating,
	splitString,
	roundToFifthDecimal,
	roundToFifthDecimalLatLng,
	roundToTen,
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
};
