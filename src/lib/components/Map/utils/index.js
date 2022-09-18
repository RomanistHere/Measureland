import { roundToHundredth } from "$lib/utilities/helpers.js";
import { booleanPointInPolygon, collect, featureCollection, featureEach, flatten, geomEach } from "@turf/turf";

const countCityStats = ({ ratings }, { name }) => {
	const { length } = ratings;

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

	return {
		name,
		ratings: averageRatingSObject,
		number: length,
	};
};

const getPointsInsideAndOutsidePolygon = (points, polygons) => {
	let inPoints = [];
	let outPoints = [];

	featureEach(points, point => {
		let contained = false;
		geomEach(polygons, polygon => {
			if (booleanPointInPolygon(point, polygon))
				contained = true;
		});

		if (contained)
			inPoints = [ ...inPoints, point ];
		else
			outPoints = [ ...outPoints, point ];
	});

	return {
		outside: featureCollection(outPoints),
		inside: featureCollection(inPoints),
	};
};

const getLayerStats = (layer, ratings) => {
	const collection = flatten({
		"type": "FeatureCollection",
		"features": ratings,
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

export {
	countCityStats,
	getPointsInsideAndOutsidePolygon,
	getLayerStats,
	assignIDsToFeatures,
};