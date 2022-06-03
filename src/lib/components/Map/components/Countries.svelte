<script>
	import L from "leaflet";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { collect, flatten, featureCollection } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { countryBounds } from "../objects/countryBounds.js";
	import { countCityStats } from "../utils";
	import { getMapZoom, debounce, openAnotherOverlay } from "$lib/utilities/helpers.js";

	let countryLayer = null;
	let hoveredCountry = null;

	const getStats = layer => {
		const collection = flatten({
			"type": "FeatureCollection",
			"features": $ratingsReference,
		});
		const layerCollection = featureCollection([ layer.feature.geometry ]);
		const { features } = collect(layerCollection, collection, "rating", "ratings");
		return countCityStats(features[0].properties, layer.feature.properties);
	};

	const initCountryLayer = () => {
		countryLayer = L.geoJson(countryBounds, {
			style: {
				color: "yellow",
				stroke: false,
				fill: false,
			},
			bubblingMouseEvents: false,
		}).addTo($mapReference);

		countryLayer.eachLayer(layer => {
			layer.on("mouseover", () => {
				layer.setStyle({ fill: true,
					fillOpacity: .3,
					opacity: .3,
					stroke: true,
				});

				hoveredCountry = getStats(layer);
			});
			layer.on("mouseout", () => {
				layer.setStyle({ fill: false, stroke: false });
				hoveredCountry = null;
			});
			layer.on("click", () => {
				$mapReference.flyToBounds(layer.getBounds());
				hoveredCountry = null;

				const { name, ratings, number } = getStats(layer);

				if (number === 0)
					return;

				openAnotherOverlay("cityRatingPopup", {
					name,
					ratings,
					number,
				});
			});
		});
	};

	const layerControl = () => {
		const zoom = getMapZoom($mapReference);
		const { length } = countryLayer ? countryLayer.getLayers() : { length: 0 };

		if (zoom >= 7 && length !== 0)
			countryLayer.clearLayers();
		else if (zoom <= 6 && (!countryLayer || length === 0))
			initCountryLayer();
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
