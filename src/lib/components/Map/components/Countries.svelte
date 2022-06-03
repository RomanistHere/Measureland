<script>
	import L from "leaflet";
	import { onMount } from "svelte";
	import { collect, flatten, featureCollection } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { countryBounds } from "../objects/countryBounds.js";
	import { countCityStats } from "../utils";
	import { getMapZoom, debounce, openAnotherOverlay } from "$lib/utilities/helpers.js";

	let countryLayer = null;

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
			});
			layer.on("mouseout", () => {
				layer.setStyle({ fill: false, stroke: false });
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
		const { length } = countryLayer ? countryLayer.getLayers() : { length: 0 };

		if (zoom >= 7 && length !== 0)
			countryLayer.clearLayers();
		else if (zoom <= 6 && (!countryLayer || length === 0))
			initCountryLayer();
	};

	$mapReference.on("zoomend", debounce(layerControl, 300));
	onMount(layerControl);
</script>
