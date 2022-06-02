<script>
	import L from "leaflet";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { collect, flatten, featureCollection } from "@turf/turf";
	import { roundToTen } from "$lib/utilities/helpers.js";

	const citiesLayer = L.geoJson(cityBounds, {
		style: {
			color: "yellow",
			fillOpacity: .05,
			opacity: .3,
		},
		bubblingMouseEvents: false,
	}).addTo($mapReference);

	citiesLayer.eachLayer(layer => {
		layer.on("click", e => {
			console.log(layer.feature);
			console.log(layer.feature.geometry);
			console.log(layer.feature.properties.name);

			const collection = flatten({
				"type": "FeatureCollection",
				"features": $ratingsReference,
			});
			const layerCollection = featureCollection([ layer.feature.geometry ]);
			const { features } = collect(layerCollection, collection, "averageRating", "ratings");
			const { ratings } = features[0].properties;
			const { length } = ratings;
			const average = roundToTen(ratings.reduce((i, acc) => acc + i, 0) / length || 0);
			console.log(`Средняя оценка: ${average} за ${length} отметок!`);
		});
	});
</script>
