import { overlayStateStore, appStateStore } from '../../stores/state.js';
import { overlayStateDefault } from '../constants/overlayStateDefault.js';

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

const openAnotherOverlay = (overlayName = null, data = {}) => {
    if (overlayName) {
        console.log(overlayStateStore)
        overlayStateStore.update(state => ({ ...state, [overlayName]: { ...state[overlayName], isOpen: true, data } }));
    } else {
        overlayStateStore.update(state => overlayStateDefault);
        appStateStore.update(state => ({ ...state, openModal: false }));
    }
}

const closeOverlays = () => openAnotherOverlay();

export {
    getAverageRating,
    splitString,
    roundToFifthDecimal,
    roundToTen,
    roundToInt,
    getColor,
    getFinalRating,
    openAnotherOverlay,
    closeOverlays,
}
