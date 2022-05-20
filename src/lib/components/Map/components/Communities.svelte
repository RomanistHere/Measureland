<script>
	import { locale } from "svelte-i18n";
	import { onMount } from "svelte";

	import L from "leaflet";
	import "../../../external/supercluster.js";

	import { communitiesLocation, communitiesLocationNearby } from "../objects/communitiesLocation.js";

	import { mapReference, poiReference } from "../../../../stores/references.js";
	import {
		debounce,
		openAnotherOverlay,
		logError,
		getBoundsData,
		getMapZoom,
		roundToFifthDecimal,
	} from "$lib/utilities/helpers.js";

	const map = $mapReference;

	let communityLayer = null;
	let communityNearbyLayer = null;

	$: isCommunity = false;
	$: isCommunityNearby = false;
	$: city = null;
	$: currentCommunityProps = null;

	const openCommunityInfo = () => {
		const { center, id } = currentCommunityProps;
		map.flyTo([ ...center ].reverse(), 14);
		openAnotherOverlay("communityInfoDialog", { communityID: id });
	};

	const handleCommunityIconClick = ({ properties }) => {
		map.flyTo([ ...properties.center ].reverse(), 14);
		openAnotherOverlay("communityInfoDialog", { communityID: properties.id });
	};

	// shadowURL is used because of leaflet z-index distribution
	const iconConfig = {
		iconUrl: "../images/map/community_icon.png",
		iconSize: [ 50, 50 ],
		iconAnchor: [ 25, 25 ],
	};

	const icon = L.icon(iconConfig);

	const hoverIcon = L.icon({
		...iconConfig,
		iconSize: [ 70, 70 ],
		iconAnchor: [ 35, 35 ],
	});

	const iconCluster = L.icon({
		// todo: multiple icon
		iconUrl: "../images/map/community_icon.png",
		iconSize: [ 50, 50 ],
		iconAnchor: [ 25, 25 ],
	});

	const transparentIcon = L.icon({
		iconUrl: "../images/map/community_icon.png",
		iconSize: [ 0, 0 ],
		iconAnchor: [ 0, 0 ],
	});

	const createClusterIcon = (feature, latlng) => {
		const isClose = getMapZoom(map) >= 15;

		if (!feature.properties.cluster) {
			// single point
			const marker = L.marker(latlng, {
				icon: isClose ? transparentIcon : icon,
				riseOnHover: true,
				zIndexOffset: -50,
			});
			marker.on("mouseover", () => { marker.setIcon(hoverIcon) });
			marker.on("mouseout", () => { marker.setIcon(icon) });
			marker.on("click", () => handleCommunityIconClick(feature));
			marker.on("keyup", e => {
				if (e.originalEvent.key === "Enter") {
					openAnotherOverlay("showRatingsPopup", e.target._latlng);
				}
			});
			return marker;
		} else {
			// cluster
			// docs: https://github.com/mapbox/supercluster
			const marker = L.marker(latlng, {
				icon: isClose ? transparentIcon : iconCluster,
				riseOnHover: true,
				zIndexOffset: -50,
			});
			marker.on("keyup", e => {
				if (e.originalEvent.key === "Enter") {
					map.zoomIn();
				}
			});
			return marker;
		}
	};

	const clusterMarkers = L.geoJson(null, {
		pointToLayer: createClusterIcon,
	}).addTo(map);

	clusterMarkers.on("click", e => {
		const clusterId = e.layer.feature.properties.cluster_id;
		const center = e.latlng;
		if (clusterId) {
			const expansionZoom = communityLayer.getClusterExpansionZoom(clusterId);
			map.setView(center, expansionZoom);
		}
	});

	const updateClusters = () => {
		// todo: see if it's possible to reuse (used in 3 files)
		try {
			const { east, north, south, west, zoom } = getBoundsData(map);
			const bbox = [ west, south, east, north ];
			const clusters = communityLayer.getClusters(bbox, zoom);

			clusterMarkers.clearLayers();
			clusterMarkers.addData(clusters);
			poiReference.set(communityLayer);
		} catch (e) {
			logError(e);
		}
	};

	const getScaledBounds = (center, zoom) => {
		// calculates boundaries for the certain zoom level without actually zooming the map
		const bounds = map.getPixelBounds(center, zoom);
		const sw = map.unproject(bounds.getBottomLeft(), zoom);
		const ne = map.unproject(bounds.getTopRight(), zoom);
		return {
			east: roundToFifthDecimal(ne.lng),
			north: roundToFifthDecimal(ne.lat),
			west: roundToFifthDecimal(sw.lng),
			south: roundToFifthDecimal(sw.lat),
		};
	};

	const updateLayers = () => {
		isCommunity = false;
		isCommunityNearby = false;
		city = null;
		currentCommunityProps = null;

		updateClusters();

		const isClose = getMapZoom(map) >= 15;

		if (!isClose)
			return;

		try {
			const { east, north, south, west } = getScaledBounds(map.getCenter(), 14);
			const bbox = [ west, south, east, north ];
			const clusters = communityLayer.getClusters(bbox, 14);

			if (clusters.length > 0) {
				const { properties } = clusters[0];
				const isCommunityListed = properties[`isCommunity_${$locale}`];

				if (isCommunityListed) {
					city = properties[`city_${$locale}`];
					isCommunity = true;
					currentCommunityProps = { ...properties };
				}
			}
		} catch (e) {
			logError(e);
		}

		if (isCommunity)
			return;

		communityNearbyLayer.eachLayer(item => {
			if (isClose && item.getBounds().contains(map.getBounds())) {
				const { feature } = item;
				const { properties } = feature;
				const isCommunityListed = properties[`isCommunity_${$locale}`];

				if (isCommunityListed) {
					city = properties[`city_${$locale}`];
					isCommunityNearby = true;
					currentCommunityProps = { ...properties };
				}
			}
		});
	};

	map.on("move", debounce(updateLayers, 300));

	onMount(() => {
		// eslint-disable-next-line  no-undef
		communityLayer = new Supercluster({
			radius: 150,
			minPoints: 2,
			minZoom: 4,
			maxZoom: 15,
		}).load(communitiesLocation.features.filter(feature => feature.properties[`isCommunity_${$locale}`]));

		communityNearbyLayer = L.geoJSON(communitiesLocationNearby, { style: { opacity: 0, fillOpacity: 0 } }).addTo(map);

		updateLayers();
	});
</script>

{#if isCommunity}
	<button
		on:click={openCommunityInfo}
		class="absolute p-4 top-20 right-4 z-5 bg-white w-64"
	>
		В {city} есть русскоговорящее сообщество!
	</button>
{/if}

{#if isCommunityNearby}
	<button
		on:click={openCommunityInfo}
		class="absolute p-4 top-20 right-4 z-5 bg-white w-64"
	>
		Неподалёку в {city} есть русскоговорящее сообщество!
	</button>
{/if}
