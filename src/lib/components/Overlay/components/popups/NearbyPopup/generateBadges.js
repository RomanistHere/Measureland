const badgesGoodPairs = {
	pairedNature: [ 'air', 'water' ],
	pairedInfrastructure: [ 'logistic', 'transport' ],
	pairedDogs: [ 'pets', 'chill' ],
	pairedWalk: [ 'air', 'chill' ],
};

export const generateBadges = (bestRatings, worstRatings, numberOfRatings) => {
	let arr = [
		...bestRatings.map(({ key, numberOfUsers }) =>
			numberOfUsers * 2 >= numberOfRatings
				? ({ key, isGood: true })
				: null,
		),
		...worstRatings.map(({ key, numberOfUsers }) =>
			numberOfUsers * 2 >= numberOfRatings
				? ({ key, isGood: false })
				: null,
		),
	]
		.filter(Boolean)
		.map(({ key, isGood }) => {
			// check if "best ratings" contains one of the worst ratings
			if (isGood) {
				const contains = worstRatings.find(item => item.key === key && item.value < 3);
				if (contains)
					return null;
				else
					return ({ key, isGood });
			} else {
				const contains = bestRatings.find(item => item.key === key && item.value > 3);
				if (contains)
					return null;
				else
					return ({ key, isGood });
			}
		})
		.filter(Boolean);

	for (const [ key, value ] of Object.entries(badgesGoodPairs)) {
		let isFirstMatched = false;
		let isSecondMatched = false;
		const [ key1, key2 ] = value;
		const isGood = true;
		for (let i = 0; i < arr.length; i++) {
			const item = arr[i];
			if (!item.isGood)
				continue;

			if (!isFirstMatched && key1 === item.key) {
				isFirstMatched = true;
			} else if (!isSecondMatched && key2 === item.key) {
				isSecondMatched = true;
			}
		}

		if (isFirstMatched && isSecondMatched) {
			arr.unshift({ key, isGood });
			arr = arr.filter(item => item.key !== key1 && item.key !== key2);
		}
	}

	return arr;
};
