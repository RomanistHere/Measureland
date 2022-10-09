import { get } from "svelte/store";
import { appStateStore, userStateStore } from "../../stores/state.js";
import { API_URL } from "../../configs/env.js";
import { convertMetersToRadian, getCookie } from "./helpers.js";

const fetchFunction = async ({ url, method, credentials, headers, body }) => {
	if (!url)
		return ({ error: "Not valid URL" });

	const { termsOfUseAgreed } = get(appStateStore);
	if (!termsOfUseAgreed)
		return ({ error: "Not agreed to the terms of use" });

	// default values
	const newMethod = method ? method : "GET";
	const newCredentials = credentials ? credentials : "include";
	const newHeaders = headers ? headers : {
		"Accept": "application/json",
		"Content-Type": "application/json",
	};
	const finalHeaders = {
		...newHeaders,
		...(newMethod !== "GET" && typeof document !== "undefined" && {
			"csrf-token": getCookie("csrf-token"),
		}),
	};

	// console.log(url, method, credentials, headers, body)
	try {
		const resp = newMethod === "POST"
			? await fetch(url, {
				method: newMethod,
				credentials: newCredentials,
				headers: finalHeaders,
				body,
			})
			: await fetch(url, {
				method: newMethod,
				credentials: newCredentials,
				headers: finalHeaders,
			});

		if (resp.status === 404)
			return ({ error: "404. No response from the server." });

		return await resp.json();
	} catch (e) {
		return ({ error: e });
	}
};

const saveToDB = async (coords, rating, averageRating, comment, isPersonalExperience, timeline) => {
	const url = `${API_URL}/geo/add`;
	const { lang } = get(userStateStore);

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			lang,
			properties: {
				rating,
				averageRating,
				comment,
				isPersonalExperience,
				timeline,
			},
			location: {
				type: "Point",
				coordinates: [ ...coords ],
			},
		}),
	});
};

const getSinglePointData = async latlng => {
	const url = `${API_URL}/geo/read_loc/${new URLSearchParams({ latlng })}`;

	return await fetchFunction({ url });
};

const getNearbyPointData = async (coords, radiusInMeters) => {
	const radius = convertMetersToRadian(radiusInMeters);
	const url = `${API_URL}/geo/read_nearby/${new URLSearchParams({ coords, radius })}`;

	return await fetchFunction({ url });
};

const fetchBoundsData = async (box, zoom, filtersObj = null) => {
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

const reactOnRating = async (ratingID, shouldReport) => {
	const url = `${API_URL}/geo/react_rating`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			ratingID,
			shouldReport,
		}),
	});
};

// POIs

const savePOIToDB = async (coords, props) => {
	const url = `${API_URL}/poi/add`;
	const { lang } = get(userStateStore);

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			properties: { ...props },
			lang,
			location: {
				type: "Point",
				coordinates: [ ...coords ],
			},
		}),
	});
};

const fetchPOIsBounds = async (box, zoom) => {
	const preparedBox = box.map(item => [ item[1], item[0] ]);
	const bounds = JSON.stringify(preparedBox);
	const url = `${API_URL}/poi/read_bounds/${new URLSearchParams({ bounds, zoom })}`;

	return await fetchFunction({ url });
};

const getSinglePointOfInterest = async latlng => {
	const url = `${API_URL}/poi/read_single/${new URLSearchParams({ latlng })}`;

	return await fetchFunction({ url });
};

const reactOnPOI = async (goal, pointID) => {
	const url = `${API_URL}/poi/react`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			pointID,
			isUpvote: goal === "upvote",
		}),
	});
};

const addCommentPOI = async (pointID, comment, username) => {
	const url = `${API_URL}/poi/add_comment`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			pointID,
			comment,
			username,
		}),
	});
};

const fetchCommentsPOI = async pointID => {
	const url = `${API_URL}/poi/read_comments/${new URLSearchParams({ pointID })}`;

	return await fetchFunction({ url });
};

const reactOnCommentPOI = async (goal, key) => {
	const url = `${API_URL}/poi/react_comment`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			key,
			goal,
		}),
	});
};

const deletePOI = async pointID => {
	const url = `${API_URL}/poi/delete_point/${new URLSearchParams({ pointID })}`;

	return await fetchFunction({ url, method: "DELETE" });
};

const deleteCommentPOI = async commentID => {
	const url = `${API_URL}/poi/delete_comment/${new URLSearchParams({ commentID })}`;

	return await fetchFunction({ url, method: "DELETE" });
};

// comments

const fetchComments = async geoID => {
	const url = `${API_URL}/geo/read_comments/${new URLSearchParams({ geoID })}`;

	return await fetchFunction({ url });
};

const reactOnComment = async (goal, key) => {
	const url = `${API_URL}/geo/react_comment`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			key,
			goal,
		}),
	});
};

// users

const register = async (email, password, lang) => {
	const url = `${API_URL}/user/register`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			password,
			email,
			lang,
		}),
	});
};

const login = async (email, password) => {
	const url = `${API_URL}/user/login`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			email,
			password,
		}),
	});
};

const disconnectEmail = async (loginStr, password) => {
	const url = `${API_URL}/user/disconnect_email`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			loginStr,
			password,
		}),
	});
};

const onboard = async (userName, ageGrp, moneyGrp, userID) => {
	const url = `${API_URL}/user/onboard`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			userName,
			ageGrp,
			moneyGrp,
			userID,
		}),
	});
};

const sendFeedback = async ({ heading, comment }, userID) => {
	const url = `${API_URL}/user/feedback`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			heading,
			comment,
			email: userID,
		}),
	});
};

const verifyUser = async token => {
	const url = `${API_URL}/user/verify/${new URLSearchParams({ token })}`;

	return await fetchFunction({ url });
};

const checkUser = async () => {
	const url = `${API_URL}/user/check_user`;

	return await fetchFunction({ url });
};

const fetchRatedPlaces = async () => {
	const url = `${API_URL}/user/read_places`;

	return await fetchFunction({ url });
};

const askMoreRatings = async () => {
	const url = `${API_URL}/user/ask_more_ratings`;

	return await fetchFunction({ url });
};

const logout = async () => {
	const url = `${API_URL}/user/logout`;

	return await fetchFunction({ url, method: "DELETE" });
};

const reverify = async email => {
	const url = `${API_URL}/user/reverify`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			email,
		}),
	});
};

const reset = async (password, token) => {
	const url = `${API_URL}/user/change_pass`;

	return await fetchFunction({
		url,
		method: "POST",
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
		method: "POST",
		body: JSON.stringify({
			email,
		}),
	});
};

const saveLang = async lang => {
	const url = `${API_URL}/user/language`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			lang,
		}),
	});
};

const voteForTask = async (goal, key) => {
	const url = `${API_URL}/user/tasks_vote`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			key,
			goal,
		}),
	});
};

const checkVotes = async id => {
	const url = `${API_URL}/user/read_votes/${new URLSearchParams({ id })}`;

	return await fetchFunction({ url });
};

const getAllTasks = async () => {
	const url = `${API_URL}/user/read_all_votes`;

	return await fetchFunction({ url });
};

const updateRatingYear = async (id, newValue) => {
	const url = `${API_URL}/user/update_rating_year`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			id,
			newValue,
		}),
	});
};

const deleteUserRating = async ratingID => {
	const url = `${API_URL}/user/delete_rating/${new URLSearchParams({ ratingID })}`;

	return await fetchFunction({ url, method: "DELETE" });
};

const reportReason = async (reportedID, type, code, comment = null) => {
	const url = `${API_URL}/user/report_reason`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({
			reportedID,
			type,
			code,
			comment,
		}),
	});
};

const authThirdParty = async ({ id, type, lang }) => {
	const url = `${API_URL}/user/auth_third_party`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({ id, type, lang }),
	});
};

const fetchStories = async () => {
	const url = `${API_URL}/stories/read_all`;

	return await fetchFunction({ url });
};

const fetchStory = async storySlug => {
	const url = `${API_URL}/stories/read_single/${new URLSearchParams({ storySlug })}`;

	return await fetchFunction({ url });
};

const reactStory = async (action, storySlug) => {
	const url = `${API_URL}/stories/react`;

	return await fetchFunction({
		url,
		method: "POST",
		body: JSON.stringify({ action, storySlug }),
	});
};

export {
	fetchFunction,
	saveToDB,
	getSinglePointData,
	getNearbyPointData,
	fetchBoundsData,
	fetchComments,
	reactOnComment,
	register,
	login,
	disconnectEmail,
	onboard,
	verifyUser,
	checkUser,
	fetchRatedPlaces,
	askMoreRatings,
	logout,
	reverify,
	reset,
	sendResetPass,
	saveLang,
	fetchSingleRating,
	reactOnRating,
	sendFeedback,
	voteForTask,
	checkVotes,
	getAllTasks,
	updateRatingYear,
	deleteUserRating,
	savePOIToDB,
	fetchPOIsBounds,
	getSinglePointOfInterest,
	reactOnPOI,
	addCommentPOI,
	fetchCommentsPOI,
	reactOnCommentPOI,
	deletePOI,
	deleteCommentPOI,
	reportReason,
	authThirdParty,
	fetchStories,
	fetchStory,
	reactStory,
};
