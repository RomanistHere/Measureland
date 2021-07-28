const initSlider = (slider) => {
    const key = slider.getAttribute('data-key')
    const setFilter = (values, handle, unencoded) => {
        const [leftVal, rightVal] = unencoded
        state = {
            ...state,
            filters: {
                ...state.filters,
                [key]: `${leftVal}-${rightVal}`
            }
        }

        if (leftVal === 1 && rightVal === 5)
            delete state.filters[key]

        if (Object.keys(state.filters).length === 0)
            state = { ...state, filters: null }
    }

    noUiSlider.create(slider, {
        start: [1, 5],
        connect: true,
        tooltips: true,
        step: 1,
        range: {
            'min': 1,
            'max': 5
        }
    })

    slider.noUiSlider.on('end', setFilter)
}

const applyFilters = () => {
    state = { ...state, isFiltersOn: true }
    const url = new URL(window.location.href)
    if (state.filters) {
		url.searchParams.set('fi', objToString(state.filters))
	}
    window.history.replaceState(null, null, url)
    getNewData()
}

const resetSlider = slider =>
    slider.noUiSlider.set([1, 5])

const resetFilters = () => {
    state = {
        ...state,
        isFiltersOn: false,
        filters: null
    }

    const sliders = $All('.filter__slider')
    sliders.forEach(resetSlider)

    const url = new URL(window.location.href)
	url.searchParams.delete('fi')
    window.history.replaceState(null, null, url)

    getNewData()
}

const openFiltersFromUrl = () => {
    const url = new URL(window.location.href)
	const filtersParam = url.searchParams.get('fi')
    if (!filtersParam)
        return

    const arrOfStrings = filtersParam.split(',')

    arrOfStrings.map(string => {
        const [key, valString] = string.split(':')
        const values = valString.split('-')
        const rangeArr = [Number(values[0]), Number(values[1])]
        state.filters = {
            ...state.filters,
            [key]: valString
        }

        const slider = $(`.filter__slider[data-key="${key}"]`)
        slider.noUiSlider.set(rangeArr)
    })

    state = { ...state, isFiltersOn: true }

    getNewData()
    openSideBar('filters')
}

const initSliders = () => {
    const sliders = $All('.filter__slider')
    sliders.forEach(initSlider)

    const connect = $All('.noUi-connect')
    connect.forEach(elem => { addClass(elem, 'connect-colored') })

    handleClickPrevDef($('.filters__apply'), applyFilters)
    handleClickPrevDef($('.filters__reset'), resetFilters)

    openFiltersFromUrl()
}

initSliders()
