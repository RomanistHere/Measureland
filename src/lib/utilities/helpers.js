import { overlayStateStore, appStateStore } from '../../stores/state.js';
import { overlayStateDefault } from '../constants/overlayStateDefault.js';

const debounce = (func, wait, immediate) => {
	var timeout
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

const sleep = milliseconds =>
    new Promise(resolve => setTimeout(resolve, milliseconds));

const getAverageRating = array =>
    array.reduce((acc, c) => acc + c.options.rating, 0) / array.length

const splitString = (str, key) =>
    str.split(key)

const roundToFifthDecimal = number =>
    Math.round(10000 * number) / 10000

const roundToTen = number =>
    Math.round(10 * number) / 10

const roundToInt = number =>
    Math.round(number)

const getColor = rating => {
    if (rating >= 4) {
        return 'green'
    } else if (rating >= 3) {
        return 'yellow'
    } else {
        return 'red'
    }
}

const additionalProps = ['pets', 'kids', 'parking']

const checkAdditionalProp = prop =>
    additionalProps.some(item => prop === item)

const getFinalRating = (obj) => {
    const keys = Object.keys(obj)
    let mainAsnwersCounter = 0
    let additionalAsnwersCounter = 0
    let sumMain = 0
    let sumAdditional = 0

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const val = obj[key]

        if (val === null)
            continue

        // check what value the property is going to have. Distribution is 75% for main props and 25 for additional ones
        const isAdditionalProp = checkAdditionalProp(key)
        if (isAdditionalProp) {
            sumAdditional = sumAdditional + val
            additionalAsnwersCounter++
        } else {
            sumMain = sumMain + val
            mainAsnwersCounter++
        }
    }

    const mainPart = mainAsnwersCounter !== 0
        ? sumMain / mainAsnwersCounter
        : 0 // 75%
    const additionalPart = additionalAsnwersCounter !== 0
        ? sumAdditional / additionalAsnwersCounter
        : 0 // 25%
    const finalRating = additionalPart !== 0
        ? (mainPart * 3 + additionalPart) / 4
        : mainPart // if no additional ratings

    return {
        answersNumber: mainAsnwersCounter + additionalAsnwersCounter,
        finalRating: finalRating,
    }
}

const closeOverlaysWithSameType = (overlayType, state) => {
    let isModalOpen = false;

    const keysArray = Object.keys(state);
    const length = keysArray.length;

    for (let i = 0; i < length; i++) {
        const { type, isOpen } = state[keysArray[i]];
        if (overlayType === type && isOpen) {
            // mutation here should be faster and has no consequences
            state[keysArray[i]].isOpen = false;
        } else {
            // check if any of other modals are open
            if (isOpen)
                isModalOpen = true;
        }
    }

    return {
        newState: state,
        isModalOpen,
    };
}

const openAnotherOverlay = (overlayName = null, data = {}) => {
    try {
		overlayStateStore.update(state => {
	        const overlayType = state[overlayName]['type'];
	        const { newState } = closeOverlaysWithSameType(overlayType, state);
	        return ({ ...newState, [overlayName]: { ...newState[overlayName], isOpen: true, data } });
	    });
	} catch (e) {
		console.warn('Define popup in constatns/overlayStateDefault.js');
	}
}

const closeOverlay = (overlayType = null) => {
    if (overlayType) {
        overlayStateStore.update(state => {
            const { newState, isModalOpen } = closeOverlaysWithSameType(overlayType, state);

            if (!isModalOpen)
                appStateStore.update(state => ({ ...state, openModal: false }));

            return ({ ...newState });
        });
    } else {
        overlayStateStore.update(state => overlayStateDefault);
        appStateStore.update(state => ({ ...state, openModal: false }));
    }
}

const closeOverlays = () => closeOverlay();

export {
    debounce,
    sleep,
    getAverageRating,
    splitString,
    roundToFifthDecimal,
    roundToTen,
    roundToInt,
    getColor,
    getFinalRating,
    openAnotherOverlay,
    closeOverlay,
    closeOverlays,
}
