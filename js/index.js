const initSentry = () => {
    const sentryOn = getCookie('sentryOn')
    if (sentryOn === '0') {
        $('.crashReportsBtn').classList.remove('settings__link-on')
        return
    }

    console.log('init sentry')

    Sentry.init({
        dsn: "https://d1ec799287aa499da5b59c4ee096878a@o920493.ingest.sentry.io/5866120",
        integrations: [new Sentry.Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        release: "Measureland@1.0.0",
    })
}

initSentry()

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
}

const onMapClick = e => {
    state.flow.push('cm')
    initQuizPopup(e.latlng)

    // geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), resp => {
    //     console.log(resp[0])
    // })
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

    // const southWest = L.latLng(-89.98155760646617, -180)
    // const northEast = L.latLng(89.99346179538875, 180)
    // const maxBounds = L.latLngBounds(southWest, northEast)

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

    // make screen after search without marker
    const geocoder = L.Control.Geocoder.nominatim()
    L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .setPosition('topleft')
    .on('markgeocode', e => {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest()
        ])
        map.fitBounds(poly.getBounds())
    })
    .addTo(map)

    // if (typeof URLSearchParams !== 'undefined' && location.search) {
    //     // parse /?geocoder=nominatim from URL
    //     const params = new URLSearchParams(location.search)
    //     const geocoderString = params.get('geocoder')
    //     if (geocoderString && L.Control.Geocoder[geocoderString]) {
    //         console.log('Using geocoder', geocoderString)
    //         geocoder = L.Control.Geocoder[geocoderString]()
    //     } else if (geocoderString) {
    //         console.warn('Unsupported geocoder', geocoderString)
    //     }
    // }

    map.on('click', onMapClick)

    return {
        map,
        geocoder
    }
}

const { map, geocoder } = initMap()

// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function() {
//         navigator.serviceWorker
//         .register("/service-worker.js")
//         .then(res => console.log("service worker registered"))
//         .catch(err => console.log("service worker not registered", err))
//     })
// }
//
// document.addEventListener('visibilitychange', () => {
//     if (document.visibilityState === 'hidden') {
//         sendFeedback()
//     }
// })
