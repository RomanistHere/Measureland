<script>
	import L from "leaflet";
	import { fly } from "svelte/transition";
	import { collect, flatten, featureCollection } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { countCityStats } from "../utils";
	import { debounce, getMapZoom, openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { onMount } from "svelte";

	let citiesLayer = null;
	let hoveredCity = null;

	const getStats = layer => {
		const collection = flatten({
			"type": "FeatureCollection",
			"features": $ratingsReference,
		});
		const layerCollection = featureCollection([ layer.feature.geometry ]);
		const { features } = collect(layerCollection, collection, "rating", "ratings");
		return countCityStats(features[0].properties, layer.feature.properties);
	};

	const initCityLayer = () => {
		citiesLayer = L.geoJson(cityBounds, {
			style: {
				color: "yellow",
				fillOpacity: .05,
				opacity: .3,
			},
			bubblingMouseEvents: false,
		}).addTo($mapReference);

		citiesLayer.eachLayer(layer => {
			layer.on("mouseover", () => {
				const zoom = getMapZoom($mapReference);
				if (zoom <= 9) {
					layer.setStyle({
						fillOpacity: .2,
						opacity: .5,
					});
				}

				hoveredCity = getStats(layer);
			});
			layer.on("mouseout", () => {
				layer.setStyle({ fillOpacity: .05, opacity: .3 });
				hoveredCity = null;
			});
			layer.on("click", () => {
				$mapReference.flyToBounds(layer.getBounds());
				hoveredCity = null;

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
		const { length } = citiesLayer ? citiesLayer.getLayers() : { length: 0 };

		if (zoom >= 13 && length !== 0)
			citiesLayer.clearLayers();
		else if (zoom <= 12 && (!citiesLayer || length === 0))
			initCityLayer();
	};

	$mapReference.on("zoomend", debounce(layerControl, 300));
	onMount(layerControl);
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
