<script>
	import L from "leaflet";
	import { collect, flatten, featureCollection } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { countCityStats } from "../utils";
	import { debounce, getMapZoom, openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { onMount } from "svelte";

	let citiesLayer = null;

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
			});
			layer.on("mouseout", () => {
				layer.setStyle({ fillOpacity: .05, opacity: .3 });
			});
			layer.on("click", () => {
				$mapReference.flyToBounds(layer.getBounds());

				const collection = flatten({
					"type": "FeatureCollection",
					"features": $ratingsReference,
				});
				const layerCollection = featureCollection([ layer.feature.geometry ]);
				const { features } = collect(layerCollection, collection, "rating", "ratings");
				const { name, ratings, number } = countCityStats(features[0].properties, layer.feature.properties);

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
