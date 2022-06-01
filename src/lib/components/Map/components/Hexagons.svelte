<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { fly } from "svelte/transition";

	import { hexGrid, flatten, collect } from "@turf/turf";
	import L from "leaflet";
	import PolyBool from "polybooljs";

	import { userStateStore, appStateStore, filtersStore } from "../../../../stores/state.js";
	import { mapReference, ratingsReference } from "../../../../stores/references.js";
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
	} from "../../../utilities/helpers.js";
	import { fetchBoundsData } from "../../../utilities/api.js";

	const map = $mapReference;

	let visitedPoly = null;
	let cachedData = [];
	let usedBounds = [];
	let isLoading = false;
	let hexagonsLayer = null;

	const colors = {
		1: "#ffec64",
		2: "#c6ca59",
		3: "#8ea94e",
		4: "#558842",
		5: "#006837",
	};

	const getHexStyle = rating => ({
		fillColor: colors[rating],
		color: colors[rating],
		weight: 0.5,
		opacity: 1,
		fillOpacity: .8,
		pointerEvents: "none",
		// interactive: false,
	});

	$: hoveredHexagon = null;

	const onEachHex = (feature, layer) => {
		const { ratings } = feature.properties;
		const average = roundToTen(ratings.reduce((i, acc) => acc + i, 0) / ratings.length || 0);
		const style = getHexStyle(roundToInt(average));
		layer.setStyle(style);

		layer.on("mouseover", () => { hoveredHexagon = { number: ratings.length, average } });
		layer.on("mouseout", () => { hoveredHexagon = null });
	};

	const zoomToHexSize = {
		18: .05,
		17: .05,
		16: .1,
		15: .1,
		14: .2,
		13: .3,
		12: .5,
		11: .8,
		10: 1,
		9: 1.5,
		8: 3,
		7: 5,
		6: 10,
		5: 20,
		4: 50,
	};

	const updateClusters = () => {
		try {
			const { east, north, south, west, zoom } = getBoundsData(map);
			const bbox = [ west, south, east, north ];

			const hexagons = hexGrid(bbox, zoomToHexSize[zoom]);
			const collection = flatten({
				"type": "FeatureCollection",
				"features": cachedData,
			});
			const hexagonsWithin = collect(hexagons, collection, "averageRating", "ratings");
			const notEmptyHexagonValues = hexagonsWithin.features.filter(({ properties }) => properties.ratings.length !== 0);
			const notEmptyHexagons = {
				"type": "FeatureCollection",
				"features": notEmptyHexagonValues,
			};
			try {
				hexagonsLayer.clearLayers();
			} catch (e) {
				console.log(e);
			}
			hexagonsLayer = L.geoJson(notEmptyHexagons, { onEachFeature: onEachHex }).addTo(map);
		} catch (e) {
			logError(e);
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

		if ($appStateStore.shouldShowLoading && !$filtersStore.isFiltersOn)
			poly.addTo(map);

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

	const subscribeToFiltersChanges = ({ isFiltersOn, filters }) => {
		if (!isFiltersOn)
			return;

		if (filters === null)
			filtersStore.update(state => ({ ...state, isFiltersOn: false }));

		getNewData();
	};
	$: subscribeToFiltersChanges($filtersStore);
</script>

{#if hoveredHexagon}
	<div
		class="absolute px-5 py-2.5 top-36 right-0 z-5 bg-white w-64 text-left rounded-l-lg overflow-hidden transition-transform translate-x-2 hover:translate-x-0"
		in:fly="{{ x: 300, duration: 500 }}"
		out:fly="{{ x: 300, duration: 500 }}"
	>
		<span class="absolute w-2.5 h-full left-0 top-0 bg-main"></span>
		<span class="block leading-5 pb-px text-main">
			{hoveredHexagon.number} оценки, средняя: {hoveredHexagon.average}
		</span>
		</div>
{/if}

{#if isLoading}
	<div
		class="absolute top-20 left-1/2 transform -translate-x-1/2 italic text-3xl pointer-events-none" transition:fade
	>
		{$_("loading.geo")}
	</div>
{/if}

<style>
	div {
		text-shadow: 0 0 2px var(--border-color);
		z-index: 1000;
	}
</style>
