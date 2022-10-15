<script>
	import { appStateStore, userStateStore, filtersStore } from "../../stores/state.js";
	import { mapReference } from "../../stores/references.js";

	import {
		roundToFifthDecimal,
		openAnotherOverlay,
		objToString,
		fillFiltersFromArrOfStrings,
		showSomethingWrongNotification,
		logError,
	} from "../utilities/helpers.js";
	import { verifyUser } from "../utilities/api.js";

	$: if (typeof window !== "undefined") {
		updateURL($appStateStore, $filtersStore);
	}

	const checkIfMapLoaded = () =>
		$mapReference !== null;

	const updateURL = ({ center, zoom, openModal, showRating, showPOI, shades, openedStory }, { isFiltersOn, filters }) => {
		const [ lat, lng ] = center;

		const url = new URL(window.location.href);
		url.searchParams.set("lat", roundToFifthDecimal(lat));
		url.searchParams.set("lng", roundToFifthDecimal(lng));
		url.searchParams.set("zoom", zoom);

		if (isFiltersOn && filters)
			url.searchParams.set("fi", objToString(filters));
		else
			url.searchParams.delete("fi");

		if (shades)
			url.searchParams.set("shades", shades);
		else
			url.searchParams.delete("shades");

		if (showRating) {
			const [ srlat, srlng ] = showRating;
			url.searchParams.set("srlat", roundToFifthDecimal(srlat));
			url.searchParams.set("srlng", roundToFifthDecimal(srlng));
		} else {
			url.searchParams.delete("srlat");
			url.searchParams.delete("srlng");
		}

		if (showPOI) {
			const [ splat, splng ] = showPOI;
			url.searchParams.set("splat", roundToFifthDecimal(splat));
			url.searchParams.set("splng", roundToFifthDecimal(splng));
		} else {
			url.searchParams.delete("splat");
			url.searchParams.delete("splng");
		}

		if (openModal) {
			url.searchParams.set("openModal", true);
			window.history.pushState(null, null, url);
		} else {
			url.searchParams.delete("openModal");
			window.history.replaceState(null, null, url);
		}

		if (openedStory) {
			url.searchParams.set("openedStory", openedStory);
			window.history.pushState(null, null, url);
		} else {
			url.searchParams.delete("openedStory");
			window.history.replaceState(null, null, url);
		}
	};

	const updateAppStateFromURL = async () => {
		const url = new URL(window.location.href);
		const lat = url.searchParams.get("lat");
		const lng = url.searchParams.get("lng");
		const zoom = url.searchParams.get("zoom");
		const filters = url.searchParams.get("fi");
		const srlat = url.searchParams.get("srlat");
		const srlng = url.searchParams.get("srlng");
		const splat = url.searchParams.get("splat");
		const splng = url.searchParams.get("splng");
		const token = url.searchParams.get("token");
		const shades = url.searchParams.get("shades");
		const openedStory = url.searchParams.get("openedStory");
		const passToken = url.searchParams.get("reset_pass_token");
		const center = [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ];

		if (lat && lng)
			appStateStore.update(state => ({ ...state, center }));

		if (zoom)
			appStateStore.update(state => ({ ...state, zoom }));

		if (shades)
			appStateStore.update(state => ({ ...state, shades }));

		if (srlat && srlng) {
			// open popup only after map is loaded
			const interval = setInterval(() => {
				const isMapReady = checkIfMapLoaded();

				if (isMapReady) {
					openAnotherOverlay("showRatingsPopup", {
						lat: roundToFifthDecimal(srlat),
						lng: roundToFifthDecimal(srlng)
					});
					clearInterval(interval);
				}
			}, 60);
		}

		if (splat && splng) {
			// open popup only after map is loaded
			const interval = setInterval(() => {
				const isMapReady = checkIfMapLoaded();

				if (isMapReady) {
					openAnotherOverlay("pointOfInterestPopup", {
						lat: roundToFifthDecimal(splat),
						lng: roundToFifthDecimal(splng),
					});
					clearInterval(interval);
				}
			}, 60);
		}

		if (openedStory) {
			// open popup only after map is loaded
			const interval = setInterval(() => {
				const isMapReady = checkIfMapLoaded();

				if (isMapReady) {
					openAnotherOverlay("storyModal", { storySlug: openedStory });
					clearInterval(interval);
				}
			}, 60);
		}

		if (filters) {
			const arrOfStrings = filters.split(",");
			fillFiltersFromArrOfStrings(arrOfStrings);
		}

		if (token) {
			url.searchParams.delete("token");
			const { error, data } = await verifyUser(token);

			if (error) {
				logError(error);
				logError("Token might be expired");
				showSomethingWrongNotification();
				return;
			}

			const { userID } = data;
			userStateStore.update(state => ({ ...state, userID }));
			openAnotherOverlay("onboardingPopup");
		}

		if (passToken && passToken.length >= 25) {
			url.searchParams.delete("reset_pass_token");
			openAnotherOverlay("typeNewPasswordModal", passToken);
		}

		url.searchParams.delete("openModal");
		window.history.replaceState(null, null, url);
	};

	if (typeof window !== "undefined") {
		updateAppStateFromURL();
	}
</script>
