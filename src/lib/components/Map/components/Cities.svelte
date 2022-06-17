<script>
	import { fly } from "svelte/transition";
	import { bbox } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { getLayerStats, assignIDsToFeatures } from "../utils";
	import { debounce, getMapZoom, openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { onMount } from "svelte";

	let hoveredCity = null;
	let hoveredCityId = null;

	const initCityLayer = () => {
		const map = $mapReference;

		map.addSource("cities", {
			type: "geojson",
			data: assignIDsToFeatures(cityBounds),
		});

		map.addLayer({
			"id": "cities-layer",
			"type": "fill",
			"maxzoom": 13,
			"minzoom": 6,
			"source": "cities",
			"layout": {
				"visibility": "visible",
			},
			"paint": {
				"fill-color": "#0080ff",
				"fill-opacity": [
					"case",
					[ "boolean", [ "feature-state", "hover" ], false ],
					.4,
					.3,
				],
			},
		});

		map.addLayer({
			"id": "cities-borders",
			"type": "line",
			"maxzoom": 13,
			"minzoom": 6,
			"source": "cities",
			"layout": {},
			"paint": {
				"line-color": "#627BC1",
				"line-width": 2,
			},
		});

		map.on("mousemove", "cities-layer", e => {
			map.getCanvas().style.cursor = "pointer";
			if (e.features.length > 0) {
				if (hoveredCityId) {
					map.setFeatureState({
						source: "cities",
						id: hoveredCityId,
					}, {
						hover: false,
					});
				}

				hoveredCityId = e.features[0].id;
				hoveredCity = getLayerStats(e.features[0], $ratingsReference);

				map.setFeatureState({
					source: "cities",
					id: hoveredCityId,
				}, {
					hover: true,
				});
			}
		});

		map.on("mouseleave", "cities-layer", () => {
			map.getCanvas().style.cursor = "";

			if (hoveredCityId !== null) {
				map.setFeatureState({
					source: "cities",
					id: hoveredCityId,
				}, {
					hover: false,
				});
			}

			hoveredCityId = null;
			hoveredCity = null;
		});

		map.on("click", "cities-layer", e => {
			hoveredCity = null;
			const bounds = bbox(e.features[0].geometry);
			map.fitBounds(bounds);

			const { name, ratings, number } = getLayerStats(e.features[0], $ratingsReference);

			if (number === 0)
				return;

			openAnotherOverlay("cityRatingPopup", {
				name,
				ratings,
				number,
			});
		});
	};

	onMount(initCityLayer);
</script>

{#if hoveredCity}
	<div
		class="absolute px-5 py-2.5 top-36 right-0 z-5 bg-white w-64 text-left rounded-l-lg overflow-hidden transition-transform translate-x-2 hover:translate-x-0 text-main"
		in:fly="{{ x: 300, duration: 500 }}"
		out:fly="{{ x: 300, duration: 500 }}"
	>
		<span class="absolute w-2.5 h-full left-0 top-0 bg-main"></span>
		<p class="pb-px font-bold">
			{hoveredCity.name}
		</p>
		<p>
			Количество оценок: {hoveredCity.number}
		</p>
		<ul>
			<li>
				Вода: {hoveredCity.ratings.water}
			</li>
			<li>
				Воздух: {hoveredCity.ratings.air}
			</li>
			<li>
				Чистота: {hoveredCity.ratings.clean}
			</li>
			<li>
				Шум: {hoveredCity.ratings.noize}
			</li>
			<li>
				Парковка: {hoveredCity.ratings.parking}
			</li>
		</ul>
	</div>
{/if}
