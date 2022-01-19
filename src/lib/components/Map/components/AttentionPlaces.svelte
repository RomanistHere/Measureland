<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import L from 'leaflet';
	// Supercluster is changed on our side, so we can't use npm's one
	import "../../../external/supercluster.js";
	
	import { mapReference, markersReference } from "../../../../stores/references.js";
	import {
		debounce, getBoundsData,
		getScreenData, logError,
		openAnotherOverlay, roundToInt,
		showSomethingWrongNotification,
	} from "$lib/utilities/helpers.js";
	import { fetchPOIsBounds } from "$lib/utilities/api.js";
	import { appStateStore } from "../../../../stores/state.js";

	const map = $mapReference;
	let clusterLayer;

	const initShowRatingPopup = ({ latlng }) =>
		openAnotherOverlay('attentionPlacesPopup', latlng);

	const icon = L.icon({
		iconUrl: `../images/attention.svg`,
		iconSize: [ 20.5, 54 ],
		iconAnchor: [ 5, 30 ],
	});
	
	const createClusterIcon = (feature, latlng) => {
		const marker = L.marker(latlng, {
			icon,
			title: `Hello`,
			riseOnHover: true,
		});
	
		if (!feature.properties.cluster) {
			// single point
			marker.on('click', initShowRatingPopup);
		}
	
		return marker;
	};
	
	const clusterMarkers = L.geoJson(null, {
		pointToLayer: createClusterIcon,
	}).addTo(map);
	
	const updateClusters = () => {
		const { east, north, south, west, zoom } = getBoundsData(map);
		const bbox = [ west, south, east, north ];
		const clusters = clusterLayer.getClusters(bbox, zoom);
	
		clusterMarkers.clearLayers();
		clusterMarkers.addData(clusters);
		markersReference.set(clusterLayer);
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
		clusterLayer = new Supercluster({
			// log: true,
			radius: 150,
			minPoints: 2,
			minZoom: 4,
		}).load(geoData);
	
		updateClusters();
	};
	
	const loadPOIs = async() => {
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
	
		addDataAndDisplay(result);
	};
	
	const destroyPOIs = () => {
		console.log('destroy');
	};
	
	map.on('moveend', () => {
		debounce(loadPOIs, 300);
	
		return () => { destroyPOIs() };
	});
	onMount(loadPOIs);
</script>
