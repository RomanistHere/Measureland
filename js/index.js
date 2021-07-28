const initSentry = () => {
    if (!state.shouldSendEvent)
        $('.crashReportsBtn').classList.remove('settings__link-on')

    Sentry.init({
        dsn: "https://d1ec799287aa499da5b59c4ee096878a@o920493.ingest.sentry.io/5866120",
        integrations: [new Sentry.Integrations.BrowserTracing()],
        tracesSampleRate: 0.1,
        release: "Measureland@1.1.2",
        beforeSend(event) {
            if (state.shouldSendEvent)
                return event
            return null
        }
    })
}

// initSentry()

// icon documentation
// https://leafletjs.com/reference-1.7.1.html#icon
const getIcon = rating =>
    L.icon({
        iconUrl: `../images/rating${rating}.svg`,
        iconSize: [61, 100],
        iconAnchor: [25, 70],
        popupAnchor: [-3, -76],
        shadowUrl: '../images/house-base.svg',
        shadowAnchor: [25, 70],
        shadowSize: [61, 100],
    })

const getGrpIcon = rating =>
    L.icon({
        iconUrl: `../images/rating${rating}.svg`,
        iconSize: [61, 100],
        iconAnchor: [25, 70],
        popupAnchor: [-3, -76],
        shadowUrl: '../images/buildings-base.svg',
        shadowAnchor: [25, 70],
        shadowSize: [61, 100],
    })

const ratingPopup = $('.ratingShow')

const initQuizPopup = (latlng) => {
    state.flow.push('iq')
    ratingPopup.classList.add('rating-active')
    $('.ratingPopup1').focus()

    state = { ...state, corrdsToSave: [roundToFifthDecimal(latlng.lat), roundToFifthDecimal(latlng.lng)] }
    addToUrlOpenModalFlag()
}

const onMapClick = e => {
    state.flow.push('cm')
    initQuizPopup(e.latlng)
    fillAdress(e.latlng)
}

const initMap = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const lat = urlParams.get('lat')
    const lng = urlParams.get('lng')
    const zoom = urlParams.get('zoom')

    if (lat && lng)
        state = { ...state, center: [ lat, lng ] }

    if (zoom)
        state = { ...state, zoom }

    const map = L.map('map', {
        center: state.center,
        minZoom: 4,
        zoom: state.zoom,
        preferCanvas: true,
        worldCopyJump: true,
        bounceAtZoomLimits: false,
    })

    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a','b','c']
    }).addTo(map)

    map.zoomControl.setPosition('bottomleft')

    map.on('click', onMapClick)

    return {
        map
    }
}

const { map } = initMap()

const addGeoSearch = () => {
    const searchControl = L.esri.Geocoding.geosearch({
        providers: [
            L.esri.Geocoding.arcgisOnlineProvider({
                apikey: esriApiKey
            })
        ],
        placeholder: state.lang === 'en' ? 'Search for places or addresses' : 'Поиск по местам и адресам',
        useMapBounds: false,
    }).addTo(map)

    searchControl.on("results", function (data) {
        console.log(data)
        map.setView(data.results[0].latlng, 17)
    })
}

addGeoSearch()

// pwa
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function() {
//         navigator.serviceWorker
//         .register("/service-worker.js")
//         .then()
//         .catch(err => console.warn("service worker not registered", err))
//     })
// }

// analycits
// document.addEventListener('visibilitychange', () => {
//     if (document.visibilityState === 'hidden') {
//         sendFeedback()
//     }
// })
