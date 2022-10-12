<script>
	import { onMount } from "svelte";
	import { locale } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { booleanOverlap, booleanContains } from "@turf/turf";

	import { mapReference } from "../../../../stores/references.js";
	import { communitiesLocation, communitiesLocationNearby } from "../objects/communitiesLocation.js";
	import { assignIDsToFeatures } from "$lib/components/Map/utils/index.js";
	import { debounce, getScreenTurfBbox, openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { mapLoadingProgress } from "../../../../stores/state.js";

	let city = null;
	let communityID = null;

	const openCommunityInfo = () => {
		openAnotherOverlay("communityAbroadModal", { communityID });
		city = null;
		communityID = null;
	};

	const updateNotificationLayer = () => {
		city = null;
		communityID = null;

		const zoomLevel = 12;
		const { bbox, zoom } = getScreenTurfBbox($mapReference, zoomLevel);

		if (zoom < zoomLevel)
			return;

		for (let i = 0; i < communitiesLocationNearby.features.length; i++) {
			const feature = communitiesLocationNearby.features[i];

			if (booleanOverlap(bbox, feature) || booleanContains(bbox, feature) || booleanContains(feature, bbox)) {
				city = feature.properties[`city_${$locale}`];
				communityID = feature.properties.id;
				return;
			}
		}
	};

	const initCommunitiesLayer = () => {
		const map = $mapReference;

		map.loadImage("../images/map/community_icon.png", (error, image) => {
			if (error)
				throw error;

			map.addImage("community", image);
		});

		map.addSource("communities", {
			type: "geojson",
			data: assignIDsToFeatures(communitiesLocation),
		});

		map.addLayer({
			"id": "communities-layer",
			"type": "symbol",
			"maxzoom": 12,
			"minzoom": 0,
			"source": "communities",
			"layout": {
				"visibility": "visible",
				"icon-image": "community",
				"icon-size": .7,
			},
		});

		map.on("click", "communities-layer", e => {
			e.originalEvent.preventDefault();
			openAnotherOverlay("communityAbroadModal", { communityID: e.features[0].properties.id });
		});

		map.on("move", debounce(updateNotificationLayer, 300));

		mapLoadingProgress.update(state => ({ ...state, communities: true }));
	};

	onMount(initCommunitiesLayer);
</script>

{#if city}
	<button
		on:click={openCommunityInfo}
		class="absolute px-5 py-2.5 top-36 right-0 z-5 bg-white w-64 text-left rounded-l-lg overflow-hidden transition-transform translate-x-2 hover:translate-x-0"
		in:fly="{{ x: 300, duration: 500 }}"
		out:fly="{{ x: 300, duration: 500 }}"
	>
		<span class="absolute w-2.5 h-full left-0 top-0 bg-main"></span>
		<span class="block leading-5 pb-px text-main">
			В {city} есть русскоязычное сообщество
		</span>
		<span class="text-txt_tertiary text-sm">
			нажми, чтобы посмотреть
		</span>
	</button>
{/if}