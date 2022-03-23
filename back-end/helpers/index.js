const User = require('../models/user.model');

const additionalProps = [ 'pets', 'kids', 'parking' ];

const checkAdditionalProp = prop =>
	additionalProps.some(item => prop === item);

exports.getFinalRating = obj => {
	const keys = Object.keys(obj);
	let mainAsnwersCounter = 0;
	let additionalAsnwersCounter = 0;
	let sumMain = 0;
	let sumAdditional = 0;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const val = obj[key];

		if (val === null)
			continue;

		// check what value the property is going to have. Distribution is 75% for main props and 25 for additional ones
		const isAdditionalProp = checkAdditionalProp(key);
		if (isAdditionalProp) {
			sumAdditional = sumAdditional + val;
			additionalAsnwersCounter++;
		} else {
			sumMain = sumMain + val;
			mainAsnwersCounter++;
		}
	}

	const mainPart = mainAsnwersCounter !== 0
		? sumMain / mainAsnwersCounter
		: 0; // 75%
	const additionalPart = additionalAsnwersCounter !== 0
		? sumAdditional / additionalAsnwersCounter
		: 0; // 25%
	const finalRating = additionalPart !== 0
		? (mainPart * 3 + additionalPart) / 4
		: mainPart; // if no additional ratings

	return {
		answersNumber: mainAsnwersCounter + additionalAsnwersCounter,
		finalRating: Math.round(100 * finalRating) / 100,
	};
};

exports.roundToTen = number =>
	Math.round(10 * number) / 10;

const markUserAsSuspicious = async userID => {
	await User.findOneAndUpdate({ _id: userID }, { isSuspicious: true });
};

const getKarmaActivity = ({ karma }) => {
	const hours = Math.abs(Date.now() - karma.lastAction) / 36e5;
	return hours > 12 ? 1 : karma.activityVal + 1;
};

exports.updateKarma = async (givingUserID, gettingUserID, isChangeNegative) => {
	const givingUser = await User.findOne({ _id: givingUserID }, 'karma usergroup isSuspicious');
	const gettingUser = await User.findOne({ _id: gettingUserID }, 'karma properties.activeRatings');

	if (givingUser.isSuspicious)
		return;

	const givingUserKarmaGrp = givingUser.karma.curVal >= 20 ? 'mid' : 'low';
	const isGivingUserNewbie = givingUserKarmaGrp === 'low';
	const karmaChange = isGivingUserNewbie ? 1 : 2;
	const karmaActivity = getKarmaActivity(givingUser);

	let numberOfActions = gettingUser.properties.activeRatings;
	let thresholdVal = gettingUser.karma.thresholdVal;

	if (((isGivingUserNewbie && karmaActivity > 4) || karmaActivity > 12) && givingUser.usergroup !== 0) {
		await markUserAsSuspicious(givingUserID);
		return;
	}

	const newKarmaValue = isChangeNegative
		? gettingUser.karma.curVal - karmaChange
		: gettingUser.karma.curVal + karmaChange;

	// every 5 karma change adds or removes one point of action
	if (newKarmaValue % 5 === 0) {
		if (gettingUser.karma.thresholdVal === newKarmaValue - 5) {
			numberOfActions = numberOfActions + 1;
		} else if (gettingUser.karma.thresholdVal === newKarmaValue + 5) {
			numberOfActions = numberOfActions - 1;
			await markUserAsSuspicious(gettingUserID);
		}

		thresholdVal = newKarmaValue;
	}

	await User.findOneAndUpdate({
		_id: gettingUserID,
	}, {
		$set: {
			'karma.curVal': newKarmaValue,
			'karma.thresholdVal': thresholdVal,
			'properties.activeRatings': numberOfActions,
		},
	});

	await User.findOneAndUpdate({
		_id: givingUserID,
	}, {
		$set: {
			'karma.activityVal': karmaActivity,
			'karma.lastAction': Date.now(),
		},
	});
};
