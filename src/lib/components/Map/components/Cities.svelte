<script>
	import L from "leaflet";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { cityBounds } from "../objects/cityBounds.js";
	import { collect, flatten, featureCollection } from "@turf/turf";
	import { roundToHundredth, openAnotherOverlay } from "$lib/utilities/helpers.js";

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
			const { features } = collect(layerCollection, collection, "rating", "ratings");
			countCityStats(features[0].properties, layer.feature.properties);
		});
	});

	const countCityStats = ({ ratings }, { name }) => {
		const ratingsObj = {
			"air": 0,
			"water": 0,
			"logistic": 0,
			"transport": 0,
			"noize": 0,
			"clean": 0,
			"chill": 0,
			"safety": 0,
			"pets": 0,
			"kids": 0,
			"parking": 0,
		};

		const { length } = ratings;
		console.log(ratings);

		const ratingSum = ratings.reduce((acc, item) => ({
			air: item.air + (acc.air || 0),
			water: item.water + (acc.water || 0),
			logistic: item.logistic + (acc.logistic || 0),
			transport: item.transport + (acc.transport || 0),
			noize: item.noize + (acc.noize || 0),
			clean: item.clean + (acc.clean || 0),
			chill: item.chill + (acc.chill || 0),
			safety: item.safety + (acc.safety || 0),
			pets: item.pets + (acc.pets || 0),
			kids: item.kids + (acc.kids || 0),
			parking: item.parking + (acc.parking || 0),
		}), {});

		const averageRatingSObject = Object.keys(ratingSum).reduce((acc, key) => ({
			...acc,
			[key]: roundToHundredth(ratingSum[key] / length),
		}), {});
		console.log(averageRatingSObject);

		openAnotherOverlay('cityRatingPopup', {
			name,
			ratings: averageRatingSObject,
			number: length,
		});
	};
</script>
