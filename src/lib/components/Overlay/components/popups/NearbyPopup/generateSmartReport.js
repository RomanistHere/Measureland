export const generateSmartReport = ratings => {
	const length = ratings.length;

	let highestRating = {
		key: null,
		value: 1,
		numberOfUsers: 0,
	};

	let secondHighestRating = {
		key: null,
		value: 1,
		numberOfUsers: 0,
	};

	let thirdHighestRating = {
		key: null,
		value: 1,
		numberOfUsers: 0,
	};

	let lowestRating = {
		key: null,
		value: 5,
		numberOfUsers: 0,
	};

	let secondLowestRating = {
		key: null,
		value: 5,
		numberOfUsers: 0,
	};

	let thirdLowestRating = {
		key: null,
		value: 5,
		numberOfUsers: 0,
	};

	for (let i = 0; i < length; i++) {
		const { rating, reported } = ratings[i];
		if (reported.length > 0)
			continue;

		for (const [ key, value ] of Object.entries(rating)) {
			if (value > 3) {
				if (value > highestRating.value) {
					highestRating = {
						key,
						value,
						numberOfUsers: 1,
					};
				} else if (value === highestRating.value && key === highestRating.key) {
					highestRating = {
						...highestRating,
						numberOfUsers: highestRating.numberOfUsers + 1,
					};
				} else if (value > secondHighestRating.value) {
					secondHighestRating = {
						key,
						value,
						numberOfUsers: 1,
					};
				} else if (value === secondHighestRating.value && key === secondHighestRating.key) {
					secondHighestRating = {
						...secondHighestRating,
						numberOfUsers: secondHighestRating.numberOfUsers + 1,
					};
				} else if (value > thirdHighestRating.value) {
					thirdHighestRating = {
						key,
						value,
						numberOfUsers: 1,
					};
				} else if (value === thirdHighestRating.value && key === thirdHighestRating.key) {
					thirdHighestRating = {
						...thirdHighestRating,
						numberOfUsers: thirdHighestRating.numberOfUsers + 1,
					};
				}
			}

			if (value > thirdLowestRating.value || value >= 4)
				continue;

			if (value < lowestRating.value) {
				lowestRating = {
					key,
					value,
					numberOfUsers: 1,
				};
			} else if (value === lowestRating.value && key === lowestRating.key) {
				lowestRating = {
					...lowestRating,
					numberOfUsers: lowestRating.numberOfUsers + 1,
				};
			} else if (value < secondLowestRating.value && key !== lowestRating.key && key !== thirdLowestRating.key) {
				secondLowestRating = {
					key,
					value,
					numberOfUsers: 1,
				};
			} else if (value === secondLowestRating.value && key === secondLowestRating.key) {
				secondLowestRating = {
					...secondLowestRating,
					numberOfUsers: secondLowestRating.numberOfUsers + 1,
				};
			} else if (value < thirdLowestRating.value && key !== lowestRating.key && key !== secondLowestRating.key) {
				thirdLowestRating = {
					key,
					value,
					numberOfUsers: 1,
				};
			} else if (value === thirdLowestRating.value && key === thirdLowestRating.key) {
				thirdLowestRating = {
					...thirdLowestRating,
					numberOfUsers: thirdLowestRating.numberOfUsers + 1,
				};
			}
		}
	}

	const bestRatings = [
		highestRating.key && highestRating,
		secondHighestRating.key && secondHighestRating,
		thirdHighestRating.key && thirdHighestRating,
	].filter(Boolean);

	const worstRatings = [
		lowestRating.key && lowestRating,
		secondLowestRating.key && secondLowestRating,
		thirdLowestRating.key && thirdLowestRating,
	].filter(Boolean);

	return {
		bestRatings,
		worstRatings,
	};
};
