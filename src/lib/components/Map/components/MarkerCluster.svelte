<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import L from 'leaflet';
    import PolyBool from 'polybooljs';
    // Supercluster is changed on our side, so we can't use npm's one
    import "../../../external/supercluster.js";

    import { userStateStore, appStateStore, filtersStore, markerStore } from "../../../../stores/state.js";
    import { mapReference, markersReference } from "../../../../stores/references.js";
    import {
	    roundToFifthDecimal,
	    roundToFifthDecimalLatLng,
	    roundToInt,
	    openAnotherOverlay,
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
    let clusterLayer;
    let isLoading = false;

    const getIcon = rating =>
    	L.icon({
    		iconUrl: `../images/rating${rating}.svg`,
    		iconSize: [ 61, 100 ],
    		iconAnchor: [ 25, 70 ],
    		popupAnchor: [ -3, -76 ],
    		shadowUrl: '../images/house-base.svg',
    		shadowAnchor: [ 25, 70 ],
    		shadowSize: [ 61, 100 ],
    	});

    const getGrpIcon = rating =>
    	L.icon({
    		iconUrl: `../images/rating${rating}.svg`,
    		iconSize: [ 61, 100 ],
    		iconAnchor: [ 25, 70 ],
    		popupAnchor: [ -3, -76 ],
    		shadowUrl: '../images/buildings-base.svg',
    		shadowAnchor: [ 25, 70 ],
    		shadowSize: [ 61, 100 ],
    	});

    const initShowRatingPopup = ({ latlng }) =>
    	openAnotherOverlay('showRatingsPopup', latlng);

    const createClusterIcon = (feature, latlng) => {
    	if (!feature.properties.cluster) {
    		// single point
    		const rating = roundToInt(feature.properties.averageRating);
    	    const icon = getIcon(Math.floor(rating));
    	    const marker = L.marker(latlng, {
    	        icon,
    	        title: `${$_('clusters.titleSingle')} ${rating}`,
    	        riseOnHover: true,
    	        rating,
    	    });
    		marker.on('click', initShowRatingPopup);
    		return marker;
    	} else {
    		// cluster
    		// docs: https://github.com/mapbox/supercluster
    		const rating = roundToInt(feature.properties.ratingSum / feature.properties.point_count);
    		const grpIcon = getGrpIcon(Math.floor(rating));
    		const marker = L.marker(latlng, {
    			icon: grpIcon,
    			title: `${$_('clusters.titleGrp')} ${rating}`,
    			riseOnHover: true,
    			rating,
    		});
    		return marker;
    	}
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

    clusterMarkers.on('click', e => {
    	const clusterId = e.layer.feature.properties.cluster_id;
    	const center = e.latlng;
    	if (clusterId) {
    		const expansionZoom = clusterLayer.getClusterExpansionZoom(clusterId);
    		map.setView(center, expansionZoom);
    	}
    });

    const clusterData = (geoData = null) => {
    	const data = geoData || cachedData;
	       // eslint-disable-next-line  no-undef
    	clusterLayer = new Supercluster({
    		// log: true,
    		radius: 150,
    		minPoints: 2,
    		minZoom: 4,
    	}).load(data);

    	updateClusters();
    };

    // addMarker cluster 2.0 version (supercluster)
    const addMarker = (coordsData, ratingData) => {
    	const newPoint = {
    		geometry: {
    			coordinates: coordsData,
    			type: 'Point',
    		},
    		properties: {
    			averageRating: ratingData,
    		},
    		type: "Feature",
    	};

    	cachedData = [ ...cachedData, newPoint ];
    };

    const removeMarker = coords => {
    	const [ lat, lng ] = coords;
    	const length = cachedData.length;
    	for (let i = 0; i < length; i++) {
    		const arr = cachedData[i]['geometry']['coordinates'];
    		if (arr[0] === lat && arr[1] === lng) {
    			cachedData.splice(i, 1);
    			return;
    		}
    	}
    };

    const handleExternalMarkers = ({ markersToAdd, markersToRemove }) => {
    	const toAddArrayLength = markersToAdd.length;
    	const toRemoveArrayLength = markersToRemove.length;

    	if (toAddArrayLength === 0 && toRemoveArrayLength === 0)
    		return;

    	if (toRemoveArrayLength !== 0) {
    		for (let i = 0; i < toRemoveArrayLength; i++) {
    			const { coords } = markersToRemove[i];
    			removeMarker(coords);
    		}
    	}

    	if (toAddArrayLength !== 0) {
    		for (let i = 0; i < toAddArrayLength; i++) {
    			const { coords, rating } = markersToAdd[i];
    			addMarker(coords, rating);
    		}
    	}

    	clusterData();

    	markerStore.update(state => ({
    		...state,
    		markersToAdd: [],
    		markersToRemove: [],
    	}));
    };

    $: handleExternalMarkers($markerStore);

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
    				coordinates: item['location']['coordinates'],
    				type: 'Point',
    			},
    			type: "Feature",
    		};
    		delete newObj['location'];
    		delete newObj['_id'];
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

    		clusterData();
    	} else {
    		clusterData(geoData);
    	}
    };

    const updateState = (coords, zoom) => {
    	const { lat, lng } = coords;
    	appStateStore.update(state => ({
    		...state,
    		center: [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ],
    		zoom,
    	}));
    };

    const getQueryPolygon = (visitedPoly, currentScreenPoly) => {
    	try {
    		const queryPolygon = visitedPoly !== null && (!$filtersStore.isFiltersOn || !$filtersStore.filters)
    			? PolyBool.differenceRev(visitedPoly, currentScreenPoly)
    			: currentScreenPoly;
    		return queryPolygon;
    	} catch (e) {
    		logError(e);
    		showSomethingWrongNotification();
    		return currentScreenPoly;
    	}
    };

    const getNewData = async() => {
    	registerAction('mapLoadData');
    	// console.warn('____________new_try____________')
    	// console.time('preparations')
	    const { center, zoom, currentScreenPoly } = getScreenData(map);

    	updateState(center, zoom);

    	const queryPolygon = getQueryPolygon(visitedPoly, currentScreenPoly);

    	// use data from cache
    	if (!queryPolygon.regions[0])
    		return clusterData();

    	const getQuery = queryPolygon => {
    		if (queryPolygon.regions[2]) {
    			return currentScreenPoly.regions[0];
    		} else if (queryPolygon.regions[1]) {
    			const secondRegLength = queryPolygon.regions[1].length;
    			const [ lastElemLat, lastElemLng ] = queryPolygon.regions[0].pop();
    			const [ , lastElemLng2 ] = queryPolygon.regions[1][secondRegLength - 1];
    			const fixedFirstPart = [ ...queryPolygon.regions[0], [ lastElemLat, lastElemLng2 ]];
    			const queryPol = [
    				...fixedFirstPart,
    				...queryPolygon.regions[1].reverse(),
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

    	if (error === 'Too many requests, please try again later') {
    		appStateStore.update(state => ({ ...state, shouldWork: false }));
    		showSomethingWrongNotification();
    		return;
    	} else if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}

    	const { result, userID } = data;

    	if (!userID) {
    		userStateStore.update(state => ({
    			...state,
    			userID: null,
    			activeRatings: 3,
    			userName: 'Аноним',
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

    map.on('moveend', debounce(getNewData, 300));
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

{#if isLoading}
    <div class="absolute top-12 left-1/2 transform -translate-x-1/2 italic text-3xl pointer-events-none" transition:fade>
        {$_('loading.geo')}
    </div>
{/if}

<style>
    div {
        text-shadow: 0 0 2px var(--border-color);
        z-index: 1000;
    }
</style>
