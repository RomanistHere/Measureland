<script>
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { collect, flatten, featureCollection, bbox } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { countryBounds } from "../objects/countryBounds.js";
	import { countCityStats } from "../utils";
	import { getMapZoom, debounce, openAnotherOverlay } from "$lib/utilities/helpers.js";

	let hoveredCountry = null;
	let hoveredStateId = null;

	const getStats = layer => {
		const collection = flatten({
			"type": "FeatureCollection",
			"features": $ratingsReference,
		});
		const layerCollection = featureCollection([ layer.geometry ]);
		const { features } = collect(layerCollection, collection, "rating", "ratings");
		return countCityStats(features[0].properties, layer.properties);
	};

	const assignIDsToFeatures = data => {
		let currentID = 0;

		return {
			...data,
			features: data.features.map(feature => {
				currentID++;
				return {
					...feature,
					id: currentID,
				};
			}),
		};
	};

	const initCountryLayer = () => {
		const map = $mapReference;

		map.addSource("countries", {
			type: "geojson",
			data: assignIDsToFeatures(countryBounds),
		});

		map.addLayer({
			"id": "countries-layer",
			"type": "fill",
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
				if (hoveredStateId) {
					map.setFeatureState({
						source: "countries",
						id: hoveredStateId,
					}, {
						hover: false,
					});
				}

				hoveredStateId = e.features[0].id;
				hoveredCountry = getStats(e.features[0]);

				map.setFeatureState({
					source: "countries",
					id: hoveredStateId,
				}, {
					hover: true,
				});
			}
		});

		map.on("mouseleave", "countries-layer", () => {
			map.getCanvas().style.cursor = "";

			hoveredCountry = null;
		});

		map.on("click", "countries-layer", e => {
			hoveredCountry = null;
			const bounds = bbox(e.features[0].geometry);
			map.fitBounds(bounds);

			const { name, ratings, number } = getStats(e.features[0]);

			if (number === 0)
				return;

			openAnotherOverlay("cityRatingPopup", {
				name,
				ratings,
				number,
			});
		});
	};

	const layerControl = () => {
		const map = $mapReference;
		const zoom = getMapZoom(map);

		const countryLayer = map.getLayer("countries-layer");

		if (zoom > 6 && countryLayer)
			map.setLayoutProperty("countries-layer", "visibility", "none");
		else if (zoom <= 6 && !countryLayer)
			initCountryLayer();
		else if (zoom <= 6 && countryLayer)
			map.setLayoutProperty("countries-layer", "visibility", "visible");
	};

	$mapReference.on("zoomend", debounce(layerControl, 300));
	onMount(layerControl);
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
