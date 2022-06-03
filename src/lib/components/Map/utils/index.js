import { roundToHundredth } from "$lib/utilities/helpers.js";

const countCityStats = ({ ratings }, { name }) => {
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

	return {
		name,
		ratings: averageRatingSObject,
		number: length,
	};
};

export {
	countCityStats,
};
