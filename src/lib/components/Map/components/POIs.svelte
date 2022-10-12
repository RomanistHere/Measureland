<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";

	import { mapReference, poiReference } from "../../../../stores/references.js";
	import {
		debounce,
		getScreenData,
		logError,
		openAnotherOverlay,
		showSomethingWrongNotification,
		truncateString,
	} from "$lib/utilities/helpers.js";
	import { fetchPOIsBounds } from "$lib/utilities/api.js";
	import { appStateStore, poisStore, mapLoadingProgress } from "../../../../stores/state.js";

	const map = $mapReference;

	let cachedPois = [];
	let hoveredPoiId = null;

	const truncateStringToTwenty = str =>
		truncateString(str, 20);

	const initPointOfInterestPopup = latlng =>
		openAnotherOverlay("pointOfInterestPopup", latlng);

	const loadPOIs = async () => {
		const { zoom, currentScreenPoly } = getScreenData(map);
		const queryBounds = currentScreenPoly.regions[0];

		const { error, data } = await fetchPOIsBounds(queryBounds, zoom);

		if (error === "Too many requests, please try again later") {
			appStateStore.update(state => ({ ...state, shouldWork: false }));
			showSomethingWrongNotification();
			return;
		} else if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		const { result } = data;
		const filteredData = result.filter(item => item.isAdequate);

		displayData(filteredData);
	};

	const debouncedLoading = debounce(loadPOIs, 300);

	// don't use native "moveend" event, it triggers on every button click in popups
	map.on("move", debouncedLoading);
	onMount(debouncedLoading);

	const imagesToLoad = {
		"red-marker": "../images/map/poi-red.png",
		"green-marker": "../images/map/poi-green.png",
		"gray-marker": "../images/map/poi-gray.png",
	};

	let loadedImages = {};

	const loadImages = (urls, callback) => {
		const makeCallback = name =>
			(err, image) => {
				loadedImages = {
					...loadedImages,
					[name]: err ? null : image,
				};

				// if all images are loaded, call the callback
				if (Object.keys(loadedImages).length === Object.keys(urls).length) {
					callback(loadedImages);
				}
			};

		if (Object.keys(loadedImages).length === Object.keys(urls).length) {
			callback(loadedImages);
			return;
		}

		for (const name in urls) {
			map.loadImage(urls[name], makeCallback(name));
		}
	};

	const preparePOIsJson = poiData => ({
		"type": "FeatureCollection",
		"features": poiData.map(({ location, title }, i) => ({
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": location["coordinates"],
			},
			"properties": {
				// todo: add type to back and and to it based on the type
				// eslint-disable-next-line max-len
				"image-name": title.includes("парк") ? "green-marker" : title.includes("завод") || title.includes("фабрика") || title.includes("развязка") || title.includes("комбинат") ? "red-marker" : "gray-marker",
				"name": truncateStringToTwenty(title),
				"full-name": title,
			},
			"id": i,
		})),
	});

	const addNonDuplicatesToArr = (arr1, arr2) => {
		let newArr = [ ...arr1 ];
		for (let i = 0; i < arr2.length; i++) {
			const elem = arr2[i];
			const isInArr = newArr.find(item => item._id === elem._id);

			if (!isInArr)
				newArr = [ ...newArr, elem ];
		}

		return newArr;
	};

	const displayData = poiData => {
		cachedPois = addNonDuplicatesToArr(cachedPois, poiData);

		loadImages(imagesToLoad, imagesResp => {
			const poiJson = preparePOIsJson(poiData);

			if (map.getSource("POIs")) {
				map.getSource("POIs").setData(poiJson);
				return;
			}

			map.addImage("red-marker", imagesResp["red-marker"], {
				"stretchX": [[ 24, 160 ]],
				"stretchY": [[ 0, 40 ]],
				"content": [ 20, 3, 170, 28 ],
				"pixelRatio": 2,
			});

			map.addImage("green-marker", imagesResp["green-marker"], {
				"stretchX": [[ 24, 160 ]],
				"stretchY": [[ 0, 40 ]],
				"content": [ 20, 3, 170, 28 ],
				"pixelRatio": 2,
			});

			map.addImage("gray-marker", imagesResp["gray-marker"], {
				"stretchX": [[ 24, 160 ]],
				"stretchY": [[ 0, 40 ]],
				"content": [ 20, 3, 170, 28 ],
				"pixelRatio": 2,
			});

			map.addSource("POIs", {
				"type": "geojson",
				"data": poiJson,
			});

			map.addLayer({
				"id": "POIs-layer",
				"type": "symbol",
				"source": "POIs",
				"layout": {
					"text-field": [ "get", "name" ],
					"text-max-width": 20,
					"icon-text-fit": "both",
					"icon-image": [ "get", "image-name" ],
					"icon-allow-overlap": false,
					"text-allow-overlap": false,
					"icon-anchor": "bottom-right",
					"text-anchor": "bottom-right",
				},
				"paint": {
					"text-color": [
						"case",
						[ "boolean", [ "feature-state", "hover" ], false ],
						"#60d9ff",
						"#fff",
					],
				},
			});

			map.on("mousemove", "POIs-layer", e => {
				e.originalEvent.preventDefault();
				map.getCanvas().style.cursor = "pointer";
				if (e.features.length > 0) {
					if (hoveredPoiId) {
						map.setFeatureState({
							source: "POIs",
							id: hoveredPoiId,
						}, {
							hover: false,
						});
					}

					hoveredPoiId = e.features[0].id;

					map.setFeatureState({
						source: "POIs",
						id: hoveredPoiId,
					}, {
						hover: true,
					});
				}
			});

			map.on("mouseleave", "POIs-layer", () => {
				map.getCanvas().style.cursor = "";

				if (hoveredPoiId !== null) {
					map.setFeatureState({
						source: "POIs",
						id: hoveredPoiId,
					}, {
						hover: false,
					});
				}

				hoveredPoiId = null;
			});

			map.on("click", "POIs-layer", e => {
				e.originalEvent.preventDefault();
				initPointOfInterestPopup({
					lat: e.features[0].geometry.coordinates[1],
					lng: e.features[0].geometry.coordinates[0],
				});
			});

			try {
				map.moveLayer("POIs-layer", "communities-layer");
				map.moveLayer("countries-layer", "POIs-layer");
			} catch (e) {
				logError("Error in layers priority change");
				logError(e);
			}
			mapLoadingProgress.update(state => ({ ...state, pois: true }));
		});
	};

	// update layer from other components through poisStore
	const addNewPOIs = newPOIs => {
		cachedPois = addNonDuplicatesToArr(cachedPois, [ ...newPOIs ]);
		const poiJson = preparePOIsJson(cachedPois);

		if (map.getSource("POIs")) {
			map.getSource("POIs").setData(poiJson);
		}
	};

	const removePOI = ({ _id }) => {
		cachedPois = cachedPois.filter(item => item._id !== _id);
		const poiJson = preparePOIsJson(cachedPois);

		if (map.getSource("POIs")) {
			map.getSource("POIs").setData(poiJson);
		}
	};

	const updateLayer = ({ markersToAdd, markersToRemove }) => {
		if (markersToRemove.length > 0) {
			markersToRemove.forEach(item => {
				removePOI(item);
			});
		}

		if (markersToAdd.length > 0) {
			const newMarkers = markersToAdd.map(item => ({
				isAdequate: true,
				location: {
					coordinates: [ ...item.coords ],
				},
				title: item.title,
			}));
			addNewPOIs(newMarkers);
		}
	};

	$: updateLayer($poisStore);
</script>
