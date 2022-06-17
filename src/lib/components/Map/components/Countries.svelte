<script>
	import { onMount } from "svelte";
	import { bbox } from "@turf/turf";
	import { fly } from "svelte/transition";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { countryBounds } from "../objects/countryBounds.js";
	import { getLayerStats, assignIDsToFeatures } from "../utils";
	import { openAnotherOverlay } from "$lib/utilities/helpers.js";

	let hoveredCountry = null;
	let hoveredCountryId = null;

	const initCountryLayer = () => {
		const map = $mapReference;

		map.addSource("countries", {
			type: "geojson",
			data: assignIDsToFeatures(countryBounds),
		});

		map.addLayer({
			"id": "countries-layer",
			"type": "fill",
			"maxzoom": 6,
			"minzoom": 0,
			"source": "countries",
			"layout": {
				"visibility": "visible",
			},
			"paint": {
				"fill-color": "#0080ff",
				"fill-opacity": [
					"case",
					[ "boolean", [ "feature-state", "hover" ], false ],
					.3,
					0,
				],
			},
		});

		map.on("mousemove", "countries-layer", e => {
			map.getCanvas().style.cursor = "pointer";
			if (e.features.length > 0) {
				if (hoveredCountryId) {
					map.setFeatureState({
						source: "countries",
						id: hoveredCountryId,
					}, {
						hover: false,
					});
				}

				hoveredCountryId = e.features[0].id;
				hoveredCountry = getLayerStats(e.features[0], $ratingsReference);

				map.setFeatureState({
					source: "countries",
					id: hoveredCountryId,
				}, {
					hover: true,
				});
			}
		});

		map.on("mouseleave", "countries-layer", () => {
			map.getCanvas().style.cursor = "";

			if (hoveredCountryId !== null) {
				map.setFeatureState({
					source: "countries",
					id: hoveredCountryId,
				}, {
					hover: false,
				});
			}

			hoveredCountryId = null;
			hoveredCountry = null;
		});

		map.on("click", "countries-layer", e => {
			hoveredCountry = null;
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

	onMount(initCountryLayer);
</script>

{#if hoveredCountry}
	<div
		class="absolute px-5 py-2.5 top-36 right-0 z-5 bg-white w-64 text-left rounded-l-lg overflow-hidden transition-transform translate-x-2 hover:translate-x-0 text-main"
		in:fly="{{ x: 300, duration: 500 }}"
		out:fly="{{ x: 300, duration: 500 }}"
	>
		<span class="absolute w-2.5 h-full left-0 top-0 bg-main"></span>
		<p class="pb-px font-bold">
			{hoveredCountry.name}
		</p>
		{#if hoveredCountry.number > 0}
			<p>
				Количество оценок: {hoveredCountry.number}
			</p>
			<ul>
				<li>
					Вода: {hoveredCountry.ratings.water}
				</li>
				<li>
					Воздух: {hoveredCountry.ratings.air}
				</li>
				<li>
					Чистота: {hoveredCountry.ratings.clean}
				</li>
				<li>
					Шум: {hoveredCountry.ratings.noize}
				</li>
				<li>
					Парковка: {hoveredCountry.ratings.parking}
				</li>
			</ul>
		{:else}
			<p>
				Пока нет оценок, будь первым!
			</p>
		{/if}
	</div>
{/if}
