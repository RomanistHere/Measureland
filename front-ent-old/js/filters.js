// const initSlider = (slider) => {
    // const key = slider.getAttribute('data-key')
    // const setFilter = (values, handle, unencoded) => {
    //     const [leftVal, rightVal] = unencoded
    //     state = {
    //         ...state,
    //         filters: {
    //             ...state.filters,
    //             [key]: `${leftVal}-${rightVal}`
    //         }
    //     }
    //
    //     if (leftVal === 1 && rightVal === 5)
    //         delete state.filters[key]
    //
    //     if (Object.keys(state.filters).length === 0)
    //         state = { ...state, filters: null }
    //
    //     const presetElems = $All('.filter__preset')
    //     presetElems.forEach(elem => { removeClass(elem, 'filter__preset-active') })
    // }
    // const setFilterText = (values, handle, unencoded) => {
    //     const [leftVal, rightVal] = unencoded
    //     const text = leftVal !== rightVal
    //         ? `${leftVal}-${rightVal}`
    //         : leftVal
    //
    //     const sliderTextElem = $(`.filter__value[data-key="${key}"]`)
    //     sliderTextElem.textContent = text
    // }

    // noUiSlider.create(slider, {
    //     start: [1, 5],
    //     connect: true,
    //     step: 1,
    //     range: {
    //         'min': 1,
    //         'max': 5
    //     }
    // })

    // slider.noUiSlider.on('end', setFilter)
    // slider.noUiSlider.on('slide', setFilterText)
// }

// const applyFilters = () => {
//     state.flow.push('fa')
//     state = { ...state, isFiltersOn: true }
//     const url = new URL(window.location.href)
//     if (state.filters) {
// 		url.searchParams.set('fi', objToString(state.filters))
// 	}
//     window.history.replaceState(null, null, url)
//     getNewData()
//     showNotification('.filters_notification')
// }

// const resetSlider = slider => {
//     slider.noUiSlider.set([1, 5])
//     const sliderTextElems = $All(`.filter__value`)
//     sliderTextElems.forEach(elem => { elem.textContent = '1-5' })
// }
//
// const resetFilters = shouldGetNewData => {
//     state.flow.push('fr')
//     state = {
//         ...state,
//         isFiltersOn: false,
//         filters: null
//     }
//
//     const sliders = $All('.filter__slider')
//     sliders.forEach(resetSlider)
//
//     const presetElems = $All('.filter__preset')
//     presetElems.forEach(elem => { removeClass(elem, 'filter__preset-active') })
//
//     const url = new URL(window.location.href)
// 	url.searchParams.delete('fi')
//     window.history.replaceState(null, null, url)
//
//     if (shouldGetNewData !== false)
//         getNewData()
//
//     hideNotification('.filters_notification')
// }

// const fillFiltersFromArrOfStrings = arrOfStrings => {
//     arrOfStrings.map(string => {
//         const [key, valString] = string.split(':')
//         const values = valString.split('-')
//         const rangeArr = [Number(values[0]), Number(values[1])]
//         state.filters = {
//             ...state.filters,
//             [key]: valString
//         }
//
//         const slider = $(`.filter__slider[data-key="${key}"]`)
//         slider.noUiSlider.set(rangeArr)
//
//         // set text
//         const [leftVal, rightVal] = rangeArr
//         const text = leftVal !== rightVal
//             ? `${leftVal}-${rightVal}`
//             : leftVal
//
//         const sliderTextElem = $(`.filter__value[data-key="${key}"]`)
//         sliderTextElem.textContent = text
//     })
//
//     state = { ...state, isFiltersOn: true }
//
//     getNewData()
// }

// const openFiltersFromUrl = () => {
//     const url = new URL(window.location.href)
// 	const filtersParam = url.searchParams.get('fi')
//     if (!filtersParam)
//         return
//
//     state.flow.push('sfv')
//     const arrOfStrings = filtersParam.split(',')
//
//     fillFiltersFromArrOfStrings(arrOfStrings)
//     showNotification('.filters_notification')
// }

// const presets = {
//     quiet: ["air:4-5", "water:4-5", "noize:4-5", "clean:4-5", "chill:4-5", "pets:4-5", "kids:4-5", "safety:4-5"],
//     center: ["clean:4-5", "safety:4-5", "logistic:4-5", "transport:4-5", "parking:3-5", "chill:3-5"],
//     nature: ["air:5-5", "water:5-5", "noize:5-5", "chill:5-5", "pets:5-5"],
//     perfect: ["air:4-5", "water:4-5", "noize:4-5", "chill:4-5", "pets:3-5", "logistic:4-5", "transport:4-5", "clean:4-5", "safety:4-5", "kids:3-5", "parking:3-5"],
// }

const handlePresetClick = e => {
    // state.flow.push('fpr')
    // const target = e.currentTarget
    // const presetName = target.getAttribute('data-preset')
    // state.flow.push(presetName)
    // const preset = presets[presetName]
    //
    // resetFilters(false)
    // fillFiltersFromArrOfStrings(preset)
    // addClass(target, 'filter__preset-active')
    showNotification('.filters_notification')
}

const initSliders = () => {
    // const sliders = $All('.filter__slider')
    // sliders.forEach(initSlider)

    // const connect = $All('.noUi-connect')
    // connect.forEach(elem => { addClass(elem, 'connect-colored') })

    // handleClickPrevDef($('.filters__apply'), applyFilters)
    // handleClickPrevDef($('.filters__reset'), resetFilters)
    handleClickPrevDef($('.filters_notification__reset'), resetFilters)

    // const presets = $All('.filter__preset')
    // presets.forEach(elem => { handleClickPrevDef(elem, handlePresetClick) })

    // openFiltersFromUrl()
}

initSliders()
