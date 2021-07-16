const placesPopup = $('.places')
const placesList = $('.places__list')
const placesClose = $('.places__close')

const initPlaces = async () => {
    runSpinner('.places__spinner')
    const { error, data } = await fetchRatedPlace()

    if (error === `Couldn't find the user`) {
        showError('userNotFound')
        window.location.reload()
        return
    } else if (error) {
        hideSpinner('.places__spinner')
        showError('unrecognizedError', error)
        return
    }

    const { places } = data
    const length = places.length

    if (length === 0) {
        const newItem = document.createElement('li')
        newItem.classList.add('places__item')
        const newLink = `<span>
            ${state.lang === 'en'
                ? 'You have not rated anything yet. Find a familiar place, click the map and rate!'
                : 'У тебя пока ноль оценок. Найди знакомое место, кликни на карту и оценивай!'}
        </span>`

        newItem.insertAdjacentHTML('beforeend', newLink)
        placesList.insertBefore(newItem, placesList.childNodes[0])

        hideSpinner('.places__spinner')
        return
    }

    for (let i = 0; i < length; i++) {
        const { coordinates } = places[i].location
        const [ lat, lng ] = coordinates

        const newItem = document.createElement('li')
        newItem.classList.add('places__item')
        const newLink = `<a class="places__link" href="https://measureland.org/?lat=${lat}&lng=${lng}">${state.lang === 'en' ? 'My rating' : 'Моя оценка'} ${places.length - i}</a>`

        newItem.insertAdjacentHTML('beforeend', newLink)
        placesList.insertBefore(newItem, placesList.childNodes[0])

        handleClickPrevDef(newItem.querySelector('.places__link'), () => {
            state.flow.push('cmp')
            closePlaces()
            openRatingAndZoom(lat, lng, 12)
        })
    }

    addToUrlOpenModalFlag()
    hideSpinner('.places__spinner')
}

const openMyPlaces = () => {
    state.flow.push('mp')
    addClass(placesPopup, 'rating-active')
    initPlaces()
}

const closePlaces = () => {
    removeClass(placesPopup, 'rating-active')

    while (placesList.firstChild)
        placesList.removeChild(placesList.firstChild)
}

const handlePlaces = () => {
    handleClickPrevDef(placesClose, closePlaces)

    handleClick(placesPopup, e => {
        if (e.target === e.currentTarget) {
            hideAllSides()
        }
    })
}

handlePlaces()
