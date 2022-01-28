<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import L from 'leaflet';
	// Supercluster is changed on our side, so we can't use npm's one
	import "../../../external/supercluster.js";
	
	import { mapReference, markersReference } from "../../../../stores/references.js";
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
	import { appStateStore } from "../../../../stores/state.js";
	
	// Mostly this file is a weak (simpler) copy of ./MarkerCluster.svelte
	// If (when) this feature is out of beta, extract logic from both files

	const map = $mapReference;
	let pointsOfInterestLayer;

	const initPointOfInterestPopup = ({ latlng }) =>
		openAnotherOverlay('pointOfInterestPopup', latlng);

	const icon = L.icon({
		iconUrl: `../images/attention.svg`,
		iconSize: [ 20.5, 54 ],
		iconAnchor: [ 5, 30 ],
	});
	
	const createClusterIcon = (feature, latlng) => {
		const marker = L.marker(latlng, {
			icon,
			title: $_('POIs.iconTitle'),
			riseOnHover: true,
		});
	
		if (!feature.properties.cluster) {
			// single point
			marker.on('click', initPointOfInterestPopup);
		}
	
		return marker;
	};
	
	const clusterMarkers = L.geoJson(null, {
		pointToLayer: createClusterIcon,
	}).addTo(map);
	
	clusterMarkers.on('click', e => {
		const clusterId = e.layer.feature.properties.cluster_id;
		const center = e.latlng;
		if (clusterId) {
			const expansionZoom = pointsOfInterestLayer.getClusterExpansionZoom(clusterId);
			map.setView(center, expansionZoom);
		}
	});
	
	const updateClusters = () => {
		const { east, north, south, west, zoom } = getBoundsData(map);
		const bbox = [ west, south, east, north ];
		const clusters = pointsOfInterestLayer.getClusters(bbox, zoom);
	
		clusterMarkers.clearLayers();
		clusterMarkers.addData(clusters);
		markersReference.set(pointsOfInterestLayer);
	};
	
	const addDataAndDisplay = data => {
		// console.time('fix geojson')
		const geoData = Object.values(data).map(item => {
			const newObj = {
				...item,
				properties: {
					averageRating: 5,
				},
				geometry: {
					coordinates: item['location']['coordinates'],
					type: 'Point',
				},
				type: "Feature",
			};
			delete newObj['location'];
			delete newObj['_id'];
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
	
		if (error === 'Too many requests, please try again later') {
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
	
	const checkTogglePOIs = ({ zoom, shouldShowPOIs }) => {
		if (shouldShowPOIs && zoom >= 13) {
			loadPOIs();
		} else {
			destroyPOIs();
		}
	};
	
	$: checkTogglePOIs($appStateStore);
	
	map.on('moveend', () => {
		const zoom = getMapZoom(map);
		if (zoom < 13) {
			destroyPOIs();
			return;
		}
		debouncedLoading();
	});
	
	onMount(() => {
		const zoom = getMapZoom(map);
		if (zoom >= 13) {
			loadPOIs();
		}
	
		return () => { destroyPOIs() };
	});
</script>
