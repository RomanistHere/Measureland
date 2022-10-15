<script>
	import { onMount } from "svelte";
	import { bbox } from "@turf/turf";
	import { fly } from "svelte/transition";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { minskDistrictsBounds } from "../objects/districtsBounds.js";
	import { getLayerStats } from "../utils";
	import { openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { mapLoadingProgress } from "../../../../stores/state.js";

	let hoveredCity = null;
	let hoveredCityId = null;

	const initCityLayer = () => {
		const map = $mapReference;

		map.addSource("districts", {
			type: "geojson",
			data: { ...minskDistrictsBounds },
			generateId: true,
		});

		map.addLayer({
			"id": "districts-layer",
			"type": "fill",
			"maxzoom": 13,
			"minzoom": 10,
			"source": "districts",
			"layout": {
				"visibility": "visible",
			},
			"paint": {
				"fill-color": "#ffa500",
				"fill-opacity": [
					"case",
					[ "boolean", [ "feature-state", "hover" ], false ],
					.15,
					.1,
				],
			},
		});

		map.addLayer({
			"id": "districts-borders",
			"type": "line",
			"maxzoom": 13,
			"minzoom": 10,
			"source": "districts",
			"layout": {},
			"paint": {
				"line-color": "#ffa500",
				"line-width": 2,
			},
		});

		const unsubscribe = mapLoadingProgress.subscribe(({ pois, hexagons }) => {
			if (pois || hexagons) {
				// it's important to assign event handlers on city at the end
				// otherwise it won't be called last and `defaultPrevented` won't work
				// todo: fire when everything's loaded
				map.on("mousemove", "districts-layer", e => {
					if (e.originalEvent.defaultPrevented) {
						hoveredCityId = null;
						hoveredCity = null;
						return;
					}

					map.getCanvas().style.cursor = "pointer";
					if (e.features.length > 0) {
						if (hoveredCityId) {
							map.setFeatureState({
								source: "districts",
								id: hoveredCityId,
							}, {
								hover: false,
							});
						}

						hoveredCityId = e.features[0].id;
						hoveredCity = getLayerStats(e.features[0], $ratingsReference);

						map.setFeatureState({
							source: "districts",
							id: hoveredCityId,
						}, {
							hover: true,
						});
					}
				});

				map.on("mouseleave", "districts-layer", () => {
					map.getCanvas().style.cursor = "";

					if (hoveredCityId !== null) {
						map.setFeatureState({
							source: "districts",
							id: hoveredCityId,
						}, {
							hover: false,
						});
					}

					hoveredCityId = null;
					hoveredCity = null;
				});

				map.on("click", "districts-layer", e => {
					if (e.originalEvent.defaultPrevented)
						return;

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

				unsubscribe();
				mapLoadingProgress.update(state => ({ ...state, districts: true }));
			}
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
