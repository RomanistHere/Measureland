<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";

	import L from "leaflet";
	// Supercluster is changed on our side, so we can't use npm's one
	import "../../../external/supercluster.js";
	
	import { mapReference, poiReference } from "../../../../stores/references.js";
	import {
		debounce,
		getBoundsData,
		getScreenData,
		getMapZoom,
		logError,
		openAnotherOverlay,
		showSomethingWrongNotification,
	} from "$lib/utilities/helpers.js";
	import { fetchPOIsBounds } from "$lib/utilities/api.js";
	import { appStateStore, poisStore } from "../../../../stores/state.js";
	
	// Mostly this file is a weak (simpler) copy of ./MarkerCluster.svelte
	// If (when) this feature is out of beta, extract logic from both files

	const map = $mapReference;
	let pointsOfInterestLayer;
	let currentCenter = [ 0, 0 ];

	const initPointOfInterestPopup = ({ latlng }) =>
		openAnotherOverlay("pointOfInterestPopup", latlng);

	const icon = L.icon({
		iconUrl: "../images/attention.svg",
		iconSize: [ 23, 54 ],
		iconAnchor: [ 5, 30 ],
	});
	
	const createClusterIcon = (feature, latlng) => {
		const marker = L.marker(latlng, {
			icon,
			title: $_("POIs.iconTitle"),
			riseOnHover: true,
		});
	
		if (!feature.properties.cluster) {
			// single point
			marker.on("click", initPointOfInterestPopup);
			marker.on("keyup", e => {
				if (e.originalEvent.key === "Enter") {
					openAnotherOverlay("pointOfInterestPopup", e.target._latlng);
				}
			});
		} else {
			marker.on("keyup", e => {
				if (e.originalEvent.key === "Enter") {
					map.zoomIn();
				}
			});
		}
	
		return marker;
	};
	
	const clusterMarkers = L.geoJson(null, {
		pointToLayer: createClusterIcon,
	}).addTo(map);
	
	clusterMarkers.on("click", e => {
		const clusterId = e.layer.feature.properties.cluster_id;
		const center = e.latlng;
		if (clusterId) {
			const expansionZoom = pointsOfInterestLayer.getClusterExpansionZoom(clusterId);
			map.setView(center, expansionZoom);
		}
	});
	
	const updateClusters = () => {
		try {
			const { east, north, south, west, zoom } = getBoundsData(map);
			const bbox = [ west, south, east, north ];
			const clusters = pointsOfInterestLayer.getClusters(bbox, zoom);

			clusterMarkers.clearLayers();
			clusterMarkers.addData(clusters);
			poiReference.set(pointsOfInterestLayer);
		} catch (e) {
			logError(e);
		}
	};

	// addMarker cluster 2.0 version (supercluster)
	const addMarker = coordsData => {
		const { points } = $poiReference;
		const newPoint = {
			geometry: {
				coordinates: coordsData,
				type: "Point",
			},
			properties: {
				averageRating: 5,
			},
			type: "Feature",
			isAdequate: true,
		};

		// eslint-disable-next-line  no-undef
		pointsOfInterestLayer = new Supercluster({
			// log: true,
			radius: 150,
			minPoints: 2,
			minZoom: 4,
			maxZoom: 18,
		}).load([ ...points, newPoint ]);

		updateClusters();
	};

	const removeMarker = coordsArr => {
		const { points } = $poiReference;
		for (let i = 0; i < points.length; i++) {
			const { coordinates } = points[i].geometry;
			if (coordinates[0] === coordsArr[0] && coordinates[1] === coordsArr[1]) {
				points.splice(i, 1);
				break;
			}
		}
		// eslint-disable-next-line  no-undef
		pointsOfInterestLayer = new Supercluster({
			// log: true,
			radius: 150,
			minPoints: 2,
			minZoom: 4,
			maxZoom: 18,
		}).load(points);

		updateClusters();
	};

	const deletePOIsExternal = ({ markersToAdd, markersToRemove }) => {
		const toAddArrayLength = markersToAdd.length;
		const toRemoveArrayLength = markersToRemove.length;

		if (toAddArrayLength === 0 && toRemoveArrayLength === 0)
			return;

		if (toRemoveArrayLength !== 0) {
			for (let i = 0; i < toRemoveArrayLength; i++) {
				removeMarker(markersToRemove[i]);
			}
		}

		if (toAddArrayLength !== 0) {
			for (let i = 0; i < toAddArrayLength; i++) {
				addMarker(markersToAdd[i]);
			}
		}

		poisStore.update(state => ({
			...state,
			markersToAdd: [],
			markersToRemove: [],
		}));
	};

	$: deletePOIsExternal($poisStore);
	
	const addDataAndDisplay = data => {
		// console.time('fix geojson')
		const geoData = Object.values(data).map(item => {
			const newObj = {
				...item,
				properties: {
					averageRating: 5,
				},
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
		// eslint-disable-next-line  no-undef
		pointsOfInterestLayer = new Supercluster({
			// log: true,
			radius: 100,
			minPoints: 3,
			minZoom: 13,
			maxZoom: 18,
		}).load(geoData);
	
		updateClusters();
	};
	
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
	
		addDataAndDisplay(filteredData);
	};
	
	const debouncedLoading = debounce(loadPOIs, 300);
	const destroyPOIs = () => clusterMarkers.clearLayers();
	
	const checkTogglePOIs = ({ zoom, shouldShowPOIs, center }) => {
		if (shouldShowPOIs && zoom >= 13) {
			if (currentCenter[0] === center[0] && currentCenter[1] === center[1])
				return;
	
			debouncedLoading();
			currentCenter = [ ...center ];
		} else {
			destroyPOIs();
		}
	};
	
	$: checkTogglePOIs($appStateStore);
	
	// don't use native "moveend" event, it triggers on every button click in popups
	map.on("move", debounce(() => {
		const zoom = getMapZoom(map);
		if (zoom < 13) {
			destroyPOIs();
			return;
		}
		debouncedLoading();
	}, 300));
	
	onMount(() => {
		const zoom = getMapZoom(map);
		if (zoom >= 13) {
			debouncedLoading();
		}
	
		return () => { destroyPOIs() };
	});
</script>
