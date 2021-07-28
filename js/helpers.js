// HELPER FUNCTIONS PART II

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

// spinner

let spinnerInterval = null
let spinnerTimeout = null
const spinnerTextRus = [
    'Обрабатываем',
    'Упс, не то!',
    'Загружаем то',
]
const spinnerTextEng = [
    'Processing',
    `Oops, it didn't work`,
    'Loading another thing',
]

const runSpinner = className => {
    const spinner = $(className)
    const textNode = spinner.querySelector('.spinner__text')

    addClass(spinner, 'spinner__wrap-active')

    if (!textNode)
        return

    let i = 0
    spinnerInterval = setInterval(() => {
        const spinnerText = state.lang === 'ru' ? [...spinnerTextRus] : [...spinnerTextEng]
        textNode.textContent = spinnerText[i]
        i = i >= 2 ? 0 : i + 1
    }, 4000)

    spinnerTimeout = setTimeout(() => {
        addClass(textNode, 'spinner__text-active')
    }, 2000)
}

const hideSpinner = className => {
    const spinner = $(className)
    const textNode = spinner.querySelector('.spinner__text')

    addClass(spinner, 'spinner__wrap-fade')
    clearInterval(spinnerInterval)
    clearTimeout(spinnerTimeout)

    setTimeout(() => {
        removeClass(spinner, 'spinner__wrap-fade')
        removeClass(spinner, 'spinner__wrap-active')
    }, 400)

    if (!textNode)
        return

    removeClass(textNode, 'spinner__text-active')
}

const showSuccessNotification = () => {
    const notification = $('.success_notif')
    if (notification.classList.contains('success_notif-show'))
        return

    addClass(notification, 'success_notif-show')
    setTimeout(() => {
        removeClass(notification, 'success_notif-show')
    }, 2000)
}

const rusRating = {
    air: 'воздух',
    water: 'воду',
    logistic: 'логистику',
    transport: 'транспорт и расположение',
    noize: 'свет и шум',
    clean: 'чистоту',
    chill: 'места для отдыха',
    safety: 'безопасность',
    pets: 'домашних животных',
    kids: 'места для детей',
    parking: 'парковку'
}

const engRating = {
    air: 'air quality',
    water: 'water quality',
    logistic: 'logistics',
    transport: 'transport and location',
    noize: 'light and noise pollution',
    clean: 'cleanliness',
    chill: 'places for rest',
    safety: 'safety',
    pets: 'live with pets',
    kids: 'ive with kids',
    parking: 'parking'
}


// TODO: remove
const fillDB = async (number) => {
    const latMax = 90
    const lngMax = 180

    const getRandomNumber = (min, max) =>
        Math.random() * (max - min) + min;

    for (let i = 0; i < number; i++) {
        const averageRating = Math.floor(getRandomNumber(1, 5))
        const actualCoords = [
            roundToFifthDecimal(getRandomNumber(-180, lngMax)),
            roundToFifthDecimal(getRandomNumber(-90, latMax))
        ]
        const quizRating = {
            air: Math.floor(getRandomNumber(1, 5)),
            water: Math.floor(getRandomNumber(1, 5)),
            logistic: Math.floor(getRandomNumber(1, 5)),
            transport: Math.floor(getRandomNumber(1, 5)),
            noize: Math.floor(getRandomNumber(1, 5)),
            clean: Math.floor(getRandomNumber(1, 5)),
            chill: Math.floor(getRandomNumber(1, 5)),
            safety: Math.floor(getRandomNumber(1, 5)),
            pets: Math.floor(getRandomNumber(1, 5)),
            kids: Math.floor(getRandomNumber(1, 5)),
            parking: Math.floor(getRandomNumber(1, 5)),
        }

        const response = await saveToDB(actualCoords, quizRating, averageRating, 'test comment auto fill', true)
    }
}

const checkSize = data => {
    const size = new TextEncoder().encode(JSON.stringify(data)).length
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    // console.log('size of data:', size, 'bytes')
    // console.log('size of data:', kiloBytes, 'kiloBytes')
    console.log('size of data:', roundToFifthDecimal(megaBytes), 'megaBytes')
}

// DATE

const dateDiffInDays = (date1, date2) => {
    const msPerDay = 1000 * 60 * 60 * 24
    const a = new Date(date1)
    const b = new Date(date2)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor(Math.abs(utc2 - utc1) / msPerDay)
}

const blockMap = () =>
    $('#map').remove()

const showErrorScreen = () =>
    addClass($('.error_screen'), 'error_screen-show')

const showLimitError = () => {
    if ($('.start'))
        $('.start').remove()
    showErrorScreen()
    addClass($('.limit_error'), 'limit_error-show')
}

const openRatingAndZoom = (lat, lng, zoom = 13) => {
    const latlng = { lat, lng }
    initRatingPopup({ latlng })

    const tryZoom = async (latlngArr) => {
        // check if neeeded function exists
        while (typeof map.setView !== 'function')
            await sleep(1000)

        map.setView(latlngArr, zoom)
    }

    tryZoom([lat, lng])
}

const showError = (key, error = null) => {
    const errorObj = {
        ru: {
            userNotFound: `У нас не получается распознать тебя, пожалуйста, залогинься ещё раз.`,
            unrecognizedError: `Какая-то ошибка. Открой консоль для дополнительной информации.`,
            locationNotFound: `Какие-то проблемы с данным местом. Попробуй обновить страницу и открыть его вручную (кликнув на него).`,
            LengthOfShapes: `Слишком много фигур. Чтобы иметь возможность поделиться нарисованными фигурами нужно удалить часть из них.`,
        },
        en: {
            userNotFound: `We have troubles recognizing you, please, relogin.`,
            unrecognizedError: `Error happened. Open console for additional info.`,
            locationNotFound: `There are some troubles with this location or our server. Try to refresh page and open it manually (by clicking it).`,
            LengthOfShapes: `Too many shapes. You need to remove some of the shapes if you want to share it.`,
        }
    }
    const lang = state.lang === 'ru' ? 'ru' : 'en'
    const message = errorObj[lang][key]

    if (error)
        console.warn(error)
    return alert(message)
}

const addToUrlOpenModalFlag = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('openModal', true)

    window.history.pushState(null, null, url)
}

const objToString = (object) => {
    let str = ''
    for (let k in object) {
        if (object.hasOwnProperty(k)) {
            str += k + ':' + object[k] + ','
        }
    }
    return str.slice(0, -1)
}

// geocoding //

const esriApiKey = 'AAPKdec033141fc049a1936e3862bd2fec4ce1WeDmCkYfNW9w7DMLrt7bfPVl8vWPRistJ8w-fEzIg0u4I6uVRL1tIxuqajfw7Q'
const geocodeService = L.esri.Geocoding.geocodeService({ apikey: esriApiKey })

const fillAdress = latlng => {
    geocodeService.reverse().latlng(latlng).language(state.lang).run((error, result) => {
        if (error) {
            console.log(error)
            return
        }
        const adress = result.address.LongLabel
        $All('.adress_bar__string').forEach(elem => elem.textContent = adress)
    })
}

const resetAdress = () => {
    const adressPlaceHolder = state.lang === 'en' ? 'calculating...' : 'высчитываем...'
    $All('.adress_bar__string').forEach(elem => elem.textContent = adressPlaceHolder)
}
