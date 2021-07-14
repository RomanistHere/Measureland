const ratePopup = $('.rate')
const rateCloseBtn = $('.rateClose')
const openCommentsBtn = $('.rate__comments')
const rateAverageRating = $('.rateAverageRating')
const rateNumberOfUsers = $('.rateNumberOfUsers')
const rateNumberOfComments = $('.rateNumberOfComments')
const ratePersonalExperience = $('.ratePersonalExperience')
const addEvaluation = $('.addEvaluation')

let showRatingState = {
    latlng: null,
    geoID: null
}

const getStarsTitle = (key, val) =>
    state.lang === 'ru' ? `Средняя оценка за ${rusRating[key]} ${val}` : `Average ${engRating[key]} rating is ${val}`

const setMarkerUrl = (coords) => {
    const { lat, lng } = coords

    const url = new URL(window.location.href)
    url.searchParams.set('lat', lat)
    url.searchParams.set('lng', lng)
    url.searchParams.set('showRating', true)

    window.history.replaceState(null, null, url)

    return url.toString()
}

const resetMarkerUrl = () => {
    const url = new URL(window.location.href)

    url.searchParams.delete('showRating')

    window.history.replaceState(null, null, url)
}

const initRatingPopup = async ({ latlng }) => {
    state.flow.push('srp')
    runSpinner('.rate__spinner')
    addClass(ratePopup, 'rating-active')
    $('.rate__popup').focus()

    const { error, data } = await getSinglePointData([ latlng.lat, latlng.lng ])

    if (error === 'Location not found') {
        showError('locationNotFound')
        resetRate()
        closeSideBar()
        return
    } else if (error) {
        showError('unrecognizedError', error)
        resetRate()
        closeSideBar()
        return
    }

    const isLoggedIn = data.userID
    if (!isLoggedIn)
        userLoggedOut()

    const markerUrl = setMarkerUrl(latlng)
    const markerUrlBtn = $('.rate__link_btn')
    const { properties } = data
    const ratingObj = properties.rating
    const props = Object.keys(ratingObj)
    const { finalRating } = getFinalRating(ratingObj)
    const zoom = state.zoom <= 12 ? 13 : state.zoom

    map.setView(latlng, zoom)

    showRatingState = { ...showRatingState, latlng: latlng, geoID: properties.geoID }

    for (let i = 0; i < props.length; i++) {
        const key = props[i]
        const val = ratingObj[key]

        if (val === null)
            continue

        const number = roundToInt(val)
        const starsWrap = ratePopup.querySelector(`.star-wrapper[data-name="${key}"]`)
        const star = starsWrap.querySelector(`.star[data-rating="${number}"]`)

        addClass(star, 'star-active')
        starsWrap.title = getStarsTitle(key, val)
    }

    rateAverageRating.textContent = roundToTen(finalRating)
    rateNumberOfUsers.textContent = properties.numberOfUsers
    rateNumberOfComments.textContent = properties.numberOfComments
    ratePersonalExperience.textContent = Math.floor(properties.numberOfPersonalExperience / properties.numberOfUsers * 100)

    markerUrlBtn.setAttribute('data-url', markerUrl)
    handleClickPrevDef(markerUrlBtn, () => {
        state.flow.push('ccu')
        try {
            navigator.clipboard.writeText(markerUrlBtn.getAttribute('data-url'))
            addClass(markerUrlBtn, 'rate__link_btn-success')
            setTimeout(() => { removeClass(markerUrlBtn, 'rate__link_btn-success') }, 1000)
        } catch (e) {
            console.log(e)
            alert(
                state.lang === 'en'
                    ? `Your browser couldn't copy address. Copy URL manually.`
                    : `Браузер не смог скопировать адрес. Скопируй URL вручную.`
            )
        }
    })

    if (properties.isRated) {
        addClass(addEvaluation, 'btn-hide')
        removeClass($('.rate__rated_btn'), 'btn-hide')
    } else {
        removeClass(addEvaluation, 'btn-hide')
        addClass($('.rate__rated_btn'), 'btn-hide')
    }

    hideSpinner('.rate__spinner')
}

const initMarkerFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const lat = urlParams.get('lat')
    const lng = urlParams.get('lng')
    const urlZoom = urlParams.get('zoom') || 13
    const zoom = urlZoom <= 12 ? 13 : urlZoom
    const showRating = urlParams.get('showRating')

    if (!showRating || !lat || !lng)
        return

    state.flow.push('sru')
    openRatingAndZoom(lat, lng, zoom)
}

const resetRate = () => {
    resetMarkerUrl()
    removeClass(ratePopup, 'rating-active')
    showRatingState = { ...showRatingState, latlng: null, geoID: null }

    const activeStars = ratePopup.querySelectorAll('.star-active')
    activeStars.forEach(item => removeClass(item, 'star-active'))
    const starsWraps = ratePopup.querySelectorAll(`.star-wrapper`)
    starsWraps.forEach(item => item.title = '')

    hideSpinner('.rate__spinner')
}

const handleRatingsBtns = () => {
    handleClickPrevDef(rateCloseBtn, () => {
        resetRate()
        closeSideBar()
    })

    handleClickPrevDef(ratePopup, e => {
        if (e.target !== e.currentTarget)
            return

        resetRate()
        closeSideBar()
    })

    handleClickPrevDef(openCommentsBtn, () => {
        state.flow.push('oc')
        showComments(showRatingState)
    })

    handleClickPrevDef(addEvaluation, () => {
        state.flow.push('iqr')
        initQuizPopup(showRatingState.latlng)
        resetRate()
        // closeSideBar()
    })

    initMarkerFromURL()
}

handleRatingsBtns()
