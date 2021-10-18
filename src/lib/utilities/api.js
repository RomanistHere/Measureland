import { get } from 'svelte/store';
import { appStateStore } from '../../stores/state.js';
import { API_URL } from '../../configs/env.js';
import { convertMetersToRadian } from './helpers.js';

const fetchFunction = async({ url, method, credentials, headers, body }) => {
	if (!url)
		return ({ error: 'Not valid URL' });

	const { termsOfUseAgreed } = get(appStateStore);
	if (!termsOfUseAgreed)
		return ({ error: 'Not agreed to the terms of use' });

	// default values
	const newMethod = method ? method : 'GET';
	const newCredentials = credentials ? credentials : 'include';
	const newHeaders = headers ? headers : {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	};

	// console.log(url)

	// console.log(url, method, credentials, headers, body)
	try {
		const resp = newMethod === 'POST'
			? await fetch(url, {
				method: newMethod,
				credentials: newCredentials,
				headers: newHeaders,
				body,
			})
			: await fetch(url, {
				method: newMethod,
				credentials: newCredentials,
				headers: newHeaders,
			});

		return await resp.json();
	} catch (e) {
		return ({ error: e });
	}
};

const saveToDB = async(coords, rating, averageRating, comment, isPersonalExperience, timeline) => {
	const url = `${API_URL}/geo/add`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			properties: {
				rating,
				averageRating,
				comment,
				isPersonalExperience,
				timeline,
			},
			location: {
				type: 'Point',
				coordinates: [ ...coords ],
			},
		}),
	});
};

const getSinglePointData = async latlng => {
	const url = `${API_URL}/geo/read_loc/${new URLSearchParams({ latlng })}`;

	return await fetchFunction({ url });
};

const getNearbyPointData = async(coords, radiusInMeters) => {
	const radius = convertMetersToRadian(radiusInMeters);
	const url = `${API_URL}/geo/read_nearby/${new URLSearchParams({ coords, radius })}`;

	return await fetchFunction({ url });
};

const fetchBoundsData = async(box, zoom, filtersObj = null) => {
	const preparedBox = box.map(item => [ item[1], item[0] ]);
	const bounds = JSON.stringify(preparedBox);
	const filters = JSON.stringify(filtersObj);
	const url = `${API_URL}/geo/read_bounds/${new URLSearchParams({ bounds, zoom, filters })}`;

	return await fetchFunction({ url });
};

// ratings

const fetchSingleRating = async ratingID => {
	const url = `${API_URL}/geo/read_rating/${new URLSearchParams({ ratingID })}`;

	return await fetchFunction({ url });
};

const reactOnRating = async(ratingID, shouldReport) => {
	const url = `${API_URL}/geo/react_rating`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			ratingID,
			shouldReport,
		}),
	});
};

// comments

const fetchComments = async geoID => {
	const url = `${API_URL}/geo/read_comments/${new URLSearchParams({ geoID })}`;

	return await fetchFunction({ url });
};

const reactOnComment = async(goal, key) => {
	const url = `${API_URL}/geo/react_comment`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			key,
			goal,
		}),
	});
};

// users

const register = async(email, password, lang) => {
	const url = `${API_URL}/user/register`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			password,
			email,
			lang,
		}),
	});
};

const login = async(email, password) => {
	const url = `${API_URL}/user/login`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			email,
			password,
		}),
	});
};

const onboard = async(userName, ageGrp, moneyGrp, userID) => {
	const url = `${API_URL}/user/onboard`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			userName,
			ageGrp,
			moneyGrp,
			userID,
		}),
	});
};

const verifyUser = async token => {
	const url = `${API_URL}/user/verify/${new URLSearchParams({ token })}`;

	return await fetchFunction({ url });
};

const checkUser = async() => {
	const url = `${API_URL}/user/check_user`;

	return await fetchFunction({ url });
};

const fetchRatedPlace = async() => {
	const url = `${API_URL}/user/read_places`;

	return await fetchFunction({ url });
};

const askMoreRatings = async() => {
	const url = `${API_URL}/user/ask_more_ratings`;

	return await fetchFunction({ url });
};

const logout = async() => {
	const url = `${API_URL}/user/logout`;

	return await fetchFunction({ url, method: 'DELETE' });
};

const reverify = async email => {
	const url = `${API_URL}/user/reverify`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			email,
		}),
	});
};

const reset = async(password, token) => {
	const url = `${API_URL}/user/change_pass`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			password,
			token,
		}),
	});
};

const sendResetPass = async email => {
	const url = `${API_URL}/user/reset_pass`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			email,
		}),
	});
};

const saveLang = async lang => {
	const url = `${API_URL}/user/language`;

	return await fetchFunction({
		url,
		method: 'POST',
		body: JSON.stringify({
			lang,
		}),
	});
};

export {
	saveToDB,
	getSinglePointData,
	getNearbyPointData,
	fetchBoundsData,
	fetchComments,
	reactOnComment,
	register,
	login,
	onboard,
	verifyUser,
	checkUser,
	fetchRatedPlace,
	askMoreRatings,
	logout,
	reverify,
	reset,
	sendResetPass,
	saveLang,
	fetchSingleRating,
	reactOnRating,
};
