<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";
	import mapboxgl from "mapbox-gl";

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
	} from "$lib/utilities/helpers.js";
	import { fetchPOIsBounds } from "$lib/utilities/api.js";
	import { appStateStore, poisStore } from "../../../../stores/state.js";

	const map = $mapReference;
	// let cachedPois = [];
	// let pointsOfInterestLayer;

	// const prepareStringToNotBreak = str =>
	// 	str.split(" ").join("\u00A0").split("-").join("\u2011");

	const truncateStringToTwenty = str =>
		truncateString(str, 20);

	// const prepareTitle = pipe(
	// 	prepareStringToNotBreak,
	// 	truncateStringToTwenty,
	// );
	// let currentCenter = [ 0, 0 ];

	// const initPointOfInterestPopup = ({ latlng }) =>
	// 	openAnotherOverlay("pointOfInterestPopup", latlng);
	//
	// const icon = L.icon({
	// 	iconUrl: "../images/attention.svg",
	// 	iconSize: [ 23, 54 ],
	// 	iconAnchor: [ 5, 30 ],
	// });

	// const createClusterIcon = (feature, latlng) => {
	// 	const marker = L.marker(latlng, {
	// 		icon,
	// 		title: $_("POIs.iconTitle"),
	// 		riseOnHover: true,
	// 	});
	//
	// 	if (!feature.properties.cluster) {
	// 		// single point
	// 		marker.on("click", initPointOfInterestPopup);
	// 		marker.on("keyup", e => {
	// 			if (e.originalEvent.key === "Enter") {
	// 				openAnotherOverlay("pointOfInterestPopup", e.target._latlng);
	// 			}
	// 		});
	// 	} else {
	// 		marker.on("keyup", e => {
	// 			if (e.originalEvent.key === "Enter") {
	// 				map.zoomIn();
	// 			}
	// 		});
	// 	}
	//
	// 	return marker;
	// };

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

	// const addDataAndDisplay = data => {
	// 	// console.time('fix geojson')
	// 	const geoData = Object.values(data).map(item => {
	// 		const newObj = {
	// 			...item,
	// 			properties: {
	// 				averageRating: 5,
	// 			},
	// 			geometry: {
	// 				coordinates: item["location"]["coordinates"],
	// 				type: "Point",
	// 			},
	// 			type: "Feature",
	// 		};
	// 		delete newObj["location"];
	// 		delete newObj["_id"];
	// 		return newObj;
	// 	});
	//
	// 	poiReference.set(pointsOfInterestLayer);
	// };

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
		// addDataAndDisplay(filteredData);
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
		"features": poiData.map(({ location, title }) => ({
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": location["coordinates"],
			},
			"properties": {
				"image-name": title.includes("парк") ? "green-marker" : title.includes("завод") || title.includes("фабрика") || title.includes("развязка") || title.includes("комбинат") ? "red-marker" : "red-marker",
				"name": truncateStringToTwenty(title),
				"full-name": title,
			},
		})),
	});

	const displayData = poiData => {
		console.log(poiData);

		loadImages(imagesToLoad, loadedImages => {
			console.log(loadedImages);

			const poiJson = preparePOIsJson(poiData);

			console.log(poiJson);

			if (map.getSource("POIs")) {
				map.getSource("POIs").setData(poiJson);
				return;
			}

			map.addImage("red-marker", loadedImages["red-marker"], {
				"stretchX": [[ 24, 160 ]],
				"stretchY": [[ 0, 40 ]],
				"content": [ 20, 3, 170, 28 ],
				"pixelRatio": 2,
			});

			map.addImage("green-marker", loadedImages["green-marker"], {
				"stretchX": [[ 24, 160 ]],
				"stretchY": [[ 0, 40 ]],
				"content": [ 20, 3, 170, 28 ],
				"pixelRatio": 2,
			});

			map.addImage("gray-marker", loadedImages["gray-marker"], {
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
				"id": "POIs",
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
				},
			});
		});
	};
</script>
