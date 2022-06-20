<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";

	import { mapReference, poiReference } from "../../../../stores/references.js";
	import {
		debounce,
		getBoundsData,
		getScreenData,
		getMapZoom,
		logError,
		openAnotherOverlay,
		showSomethingWrongNotification,
		truncateString,
		pipe,
		roundToHundredth,
	} from "$lib/utilities/helpers.js";
	import { fetchPOIsBounds } from "$lib/utilities/api.js";
	import { appStateStore, poisStore, mapLoadingProgress } from "../../../../stores/state.js";

	const map = $mapReference;

	let cachedPois = [];
	let hoveredPoiId = null;
	// let pointsOfInterestLayer;

	const truncateStringToTwenty = str =>
		truncateString(str, 20);

	// const prepareTitle = pipe(
	// 	prepareStringToNotBreak,
	// 	truncateStringToTwenty,
	// );
	// let currentCenter = [ 0, 0 ];

	const initPointOfInterestPopup = latlng =>
		openAnotherOverlay("pointOfInterestPopup", latlng);

	// clusterMarkers.on("click", e => {
	// 	const clusterId = e.layer.feature.properties.cluster_id;
	// 	const center = e.latlng;
	// 	if (clusterId) {
	// 		const expansionZoom = pointsOfInterestLayer.getClusterExpansionZoom(clusterId);
	// 		map.setView(center, expansionZoom);
	// 	}
	// });

	// const addMarker = coordsData => {
	// 	const newPoint = {
	// 		geometry: {
	// 			coordinates: coordsData,
	// 			type: "Point",
	// 		},
	// 		properties: {
	// 			title: "Tobacco factory",
	// 			isAdequate: true,
	// 		},
	// 		type: "Feature",
	// 	};
	//
	// 	const el = document.createElement("button");
	// 	el.className = "marker-poi";
	// 	// const imgUrl = "asdas";
	// 	// el.style.backgroundImage = `url(${imgUrl})`;
	//
	// 	new mapboxgl.Marker(el)
	// 		.setLngLat([ -122.4, 37.7 ])
	// 		.addTo(map);
	// };

	// const removeMarker = coordsArr => {
	// 	const { points } = $poiReference;
	// 	for (let i = 0; i < points.length; i++) {
	// 		const { coordinates } = points[i].geometry;
	// 		if (coordinates[0] === coordsArr[0] && coordinates[1] === coordsArr[1]) {
	// 			points.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// 	// eslint-disable-next-line  no-undef
	// 	pointsOfInterestLayer = new Supercluster({
	// 		// log: true,
	// 		radius: 150,
	// 		minPoints: 2,
	// 		minZoom: 4,
	// 		maxZoom: 18,
	// 	}).load(points);
	//
	// 	updateClusters();
	// };

	// const deletePOIsExternal = ({ markersToAdd, markersToRemove }) => {
	// 	const toAddArrayLength = markersToAdd.length;
	// 	const toRemoveArrayLength = markersToRemove.length;
	//
	// 	if (toAddArrayLength === 0 && toRemoveArrayLength === 0)
	// 		return;
	//
	// 	if (toRemoveArrayLength !== 0) {
	// 		for (let i = 0; i < toRemoveArrayLength; i++) {
	// 			removeMarker(markersToRemove[i]);
	// 		}
	// 	}
	//
	// 	if (toAddArrayLength !== 0) {
	// 		for (let i = 0; i < toAddArrayLength; i++) {
	// 			addMarker(markersToAdd[i]);
	// 		}
	// 	}
	//
	// 	poisStore.update(state => ({
	// 		...state,
	// 		markersToAdd: [],
	// 		markersToRemove: [],
	// 	}));
	// };
	//
	// $: deletePOIsExternal($poisStore);

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
	// const destroyPOIs = () => clusterMarkers.clearLayers();
	//
	// const checkTogglePOIs = ({ zoom, shouldShowPOIs, center }) => {
	// 	if (shouldShowPOIs && zoom >= 13) {
	// 		if (currentCenter[0] === center[0] && currentCenter[1] === center[1])
	// 			return;
	//
	// 		debouncedLoading();
	// 		currentCenter = [ ...center ];
	// 	} else {
	// 		destroyPOIs();
	// 	}
	// };
	//
	// $: checkTogglePOIs($appStateStore);

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

	const addNewPOI = newPOI => {
		// todo: check
		cachedPois = addNonDuplicatesToArr(cachedPois, [ newPOI ]);
		const poiJson = preparePOIsJson(cachedPois);

		if (map.getSource("POIs")) {
			map.getSource("POIs").setData(poiJson);
		}
	};

	const removePOI = poi => {
		// todo: check
		// cachedPois = removeFromArr(cachedPois, poi);
		// const poiJson = preparePOIsJson(cachedPois);
		//
		// if (map.getSource("POIs")) {
		// 	map.getSource("POIs").setData(poiJson);
		// }
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
					"text-color": "#ffffff",
					"icon-opacity": [
						"case",
						[ "boolean", [ "feature-state", "hover" ], false ],
						.7,
						1,
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
				initPointOfInterestPopup({
					lat: e.features[0].geometry.coordinates[1],
					lng: e.features[0].geometry.coordinates[0],
				});
			});

			mapLoadingProgress.update(state => ({ ...state, pois: true }));
		});
	};
</script>
