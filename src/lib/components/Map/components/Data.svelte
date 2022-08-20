<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	import { hexGrid, flatten, collect } from "@turf/turf";
	import L from "leaflet";
	import PolyBool from "polybooljs";

	import { userStateStore, appStateStore, filtersStore, markerStore } from "../../../../stores/state.js";
	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { getPointsInsideAndOutsidePolygon } from "../utils";
	import {
		roundToFifthDecimal,
		roundToInt,
		roundToTen,
		debounce,
		showSomethingWrongNotification,
		registerAction,
		logError,
		getBoundsData,
		getScreenData,
		openAnotherOverlay,
	} from "../../../utilities/helpers.js";
	import { fetchBoundsData } from "../../../utilities/api.js";

	const map = $mapReference;

	let isLoading = false;
	let visitedPoly = null;
	let usedBounds = [];
	let cachedData = [];

	const updateState = (coords, zoom) => {
		const { lat, lng } = coords;

		appStateStore.update(state => ({
			...state,
			center: [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ],
			zoom,
		}));
	};

	const getQueryPolygon = (visitedPolyRef, currentScreenPoly) => {
		try {
			return visitedPolyRef !== null && (!$filtersStore.isFiltersOn || !$filtersStore.filters)
				? PolyBool.differenceRev(visitedPolyRef, currentScreenPoly)
				: currentScreenPoly;
		} catch (e) {
			logError(e);
			showSomethingWrongNotification();
			return currentScreenPoly;
		}
	};

	const checkDataForRepeat = geoData => {
		// due to some cases that is not covered by poolybool we need to check
		// if didn't load the same data twice, if so reset cached data, othervise
		// user will see group icons instead of single ones
		// TODO: WATCH FOR THE PERFORMANCE!!!
		const isRepeated = geoData.some(newItem => {
			const coords = newItem.geometry.coordinates.toString();
			return cachedData.find(item => item.geometry.coordinates.toString() === coords);
		});

		if (isRepeated) {
			cachedData = [];
			usedBounds = [];
			visitedPoly = null;
			return true;
		} else {
			cachedData = [ ...cachedData, ...geoData ];
			ratingsReference.update(state => cachedData);
			return false;
		}
	};

	const addDataAndDisplay = data => {
		// console.time('fix geojson')
		const geoData = Object.values(data).map(item => {
			const newObj = {
				...item,
				geometry: {
					coordinates: item["location"]["coordinates"],
					type: "Point",
				},
				type: "Feature",
			};
			delete newObj["location"];
			delete newObj["_id"];
			return newObj;
		});

		if (!$filtersStore.isFiltersOn) {
			const shouldRedownload = checkDataForRepeat(geoData);
			if (shouldRedownload) {
				getNewData();
				return;
			}
			// console.log('total number of points in cache: ', cachedData.length)

			// console.timeEnd('fix geojson')
		}

		updateClusters();
	};

	const updateClusters = () => {
		// console.log(cachedData);
	};

	const getNewData = async () => {
		registerAction("mapLoadData");
		// console.warn('____________new_try____________')
		// console.time('preparations')
		const { center, zoom, currentScreenPoly } = getScreenData(map);

		updateState(center, zoom);

		const queryPolygon = getQueryPolygon(visitedPoly, currentScreenPoly);

		// use data from cache
		if (!queryPolygon.regions[0])
			return updateClusters();

		const getQuery = queryPolygonRef => {
			if (queryPolygonRef.regions[2]) {
				return currentScreenPoly.regions[0];
			} else if (queryPolygonRef.regions[1]) {
				const secondRegLength = queryPolygonRef.regions[1].length;
				const [ lastElemLat, lastElemLng ] = queryPolygonRef.regions[0].pop();
				const [ , lastElemLng2 ] = queryPolygonRef.regions[1][secondRegLength - 1];
				const fixedFirstPart = [ ...queryPolygonRef.regions[0], [ lastElemLat, lastElemLng2 ]];
				const queryPol = [
					...fixedFirstPart,
					...queryPolygonRef.regions[1].reverse(),
					[ lastElemLat + 0.001, lastElemLng2 ],
					[ lastElemLat + 0.001, lastElemLng ],
				];
				return queryPol;
			} else {
				return queryPolygon.regions[0];
			}
		};

		isLoading = true;

		const query = getQuery(queryPolygon);
		const poly = L.polygon(query, {
			// generate random color to see the difference between areas
			fillColor: `#${((1 << 24) * Math.random() | 0).toString(16)}`,
			fillOpacity: 0.3,
			weight: 2,
		});

		if (!$filtersStore.isFiltersOn)
			usedBounds.push(poly);

		const filters = $filtersStore.isFiltersOn ? $filtersStore.filters : null;
		// console.timeEnd('preparations')
		// console.time('fetch new data')
		const { error, data } = await fetchBoundsData(query, zoom, filters);
		// console.timeEnd('fetch new data')

		if (error === "Too many requests, please try again later") {
			appStateStore.update(state => ({ ...state, shouldWork: false }));
			showSomethingWrongNotification();
			isLoading = false;
			return;
		} else if (error) {
			logError(error);
			showSomethingWrongNotification();
			isLoading = false;
			return;
		}

		const { result, userID } = data;

		if (!userID) {
			userStateStore.update(state => ({
				...state,
				userID: null,
				activeRatings: 3,
				userName: "Аноним",
				wantMoreRatings: false,
			}));
		}

		// TODO:
		// console.log('number of downloaded points: ', result.length)

		try {
			if (!$filtersStore.isFiltersOn) {
				visitedPoly = visitedPoly !== null
					? PolyBool.union(visitedPoly, queryPolygon)
					: currentScreenPoly;
			}
		} catch (e) {
			logError(e);
			showSomethingWrongNotification();
		}

		// checkSize(result)
		isLoading = false;
		addDataAndDisplay(result);
	};

	// don't use native "moveend" event, it triggers on every button click in popups
	map.on("move", debounce(getNewData, 300));
	onMount(getNewData);

	// update layer from other components through markerStore
	const externalUpdateMarkers = ({ markersToAdd, markersToRemove }) => {
		if (markersToRemove.length > 0) {
			markersToRemove.forEach(item => {
				cachedData = cachedData.filter(cachedItem => {
					const { coordinates } = cachedItem.geometry;
					const { coords } = item;
					return coordinates[0] !== coords[0] && coordinates[1] !== coords[1];
				});
			});

			ratingsReference.update(state => cachedData);
		}

		if (markersToAdd.length > 0) {
			markersToAdd.forEach(item => {
				const newObj = {
					geometry: {
						coordinates: [ ...item.coords ],
						type: "Point",
					},
					type: "Feature",
					properties: {
						averageRating: item.averageRating,
						rating: { ...item.ratings },
					},
				};
				cachedData = [ ...cachedData, newObj ];
			});

			ratingsReference.update(state => cachedData);
		}
	};

	$: externalUpdateMarkers($markerStore);
</script>
