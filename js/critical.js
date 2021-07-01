// HELPER FUNCTIONS PART I
const $ = selector =>
    document.querySelector(selector)

const $All = selector =>
    document.querySelectorAll(selector)

const addClass = (elem, className) =>
    elem.classList.add(className)

const sleep = milliseconds =>
    new Promise(resolve => setTimeout(resolve, milliseconds))

const removeClass = (elem, cl1, cl2 = null, cl3 = null, cl4 = null, cl5 = null, cl6 = null) =>
    elem.classList.remove(cl1, cl2, cl3, cl4, cl5, cl6)

const handleClick = (elem, callback) =>
    elem.addEventListener('click', e => callback(e))

const handleClickPrevDef = (elem, callback) =>
    elem.addEventListener('click', (e) => { e.preventDefault(); callback(e) })

const handleEnterPrevDef = (elem, callback) =>
    elem.addEventListener('keyup', e => { if (e.keyCode === 13) { e.preventDefault(); callback(e) } })

const detectPrefLang = () => {
    // TODO: apache
    // detect based on browser language
    // const prefLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
    // if (prefLang === 'ru' || prefLang === 'be' || navigator.languages.includes('ru') || navigator.languages.includes('be'))
    //     return 'ru'
    // else
    //     return 'en'
    console.log(window.location.pathname.includes('/ru/') ? 'ru' : 'en')
    return window.location.pathname.includes('/ru/') ? 'ru' : 'en'
}

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

const getCookie = (cname) => {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

const detectLocation = () => {
    state.flow.push('dl')
    if (!navigator.geolocation)
        return

    const urlParams = new URLSearchParams(window.location.search)
    const lat = urlParams.get('lat')
    const lng = urlParams.get('lng')

    if (lat && lng)
        return

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        console.log(coords)
        const { latitude, longitude } = coords
        state = {
            ...state,
            center: [ latitude, longitude ]
        }

        const tryZoom = async (latlngArr) => {
            // check if neeeded function exists
            while (typeof map.setView !== 'function')
                await sleep(1000)

            map.setView(latlngArr, 15)
        }

        tryZoom([latitude, longitude])
    })
}

// INIT APP STATE

let state = {
    userID: null,
    passToken: null,
    dateCreated: null,
    ratingToSave: null,
    corrdsToSave: null,
    userName: 'Аноним',
    lang: detectPrefLang(),
    center: [53.901, 27.546],
    zoom: 12,
    flow: [],
    shouldShowLoading: false,
}

let startScreenState = {
    terms: true,
    detectLoc: true
}

// START SCREEN FUNCTION

const positionStartScreen = () => {
    const startImage = $('.start__image')
    const imageCont = $('.start')

    let isStartShown = true

    addClass(imageCont, 'start-show')

    const setStartScreen = () => {
        const startRect = startImage.getBoundingClientRect()
        const startWidth = startRect.width
        const startHeight = startRect.height
        const windowWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
        const windowHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight

        if (windowHeight > startHeight) {
            startImage.style.height = '100%'
            startImage.style.width = 'auto'
            if (windowWidth > 1024) {
                imageCont.scrollLeft = 2000
            } else {
                const imageWidth = startImage.getBoundingClientRect().width
                imageCont.scrollLeft = imageWidth / 2
            }
        }
        if (windowWidth > startWidth) {
            startImage.style.width = '100%'
            startImage.style.height = 'auto'
        }
    }

    setStartScreen()
    // TODO: test timeout
    setTimeout(setStartScreen, 100)
    setTimeout(setStartScreen, 300)
    window.addEventListener('resize', setStartScreen)

    const startScrenWheel = (e) => {
        if (isStartShown) {
            if (e.deltaY > 0)
                imageCont.scrollLeft += 50
            else
                imageCont.scrollLeft -= 50
        }
    }

    window.addEventListener('wheel', startScrenWheel)

    const engButton = $('.start__eng_lang')
    const rusButton = $('.start__rus_lang')

    const tryChangeLang = async (lang) => {
        // check if neeeded function exists
        while (typeof changeLang !== 'function')
            await sleep(1000)

        if (!state.userID) {
            changeLang(lang)
        } else {
            const result = await saveLang(lang)
            changeLang(lang)
        }
    }

    handleClickPrevDef(engButton, () => {
        tryChangeLang('en')
    })

    handleClickPrevDef(rusButton, () => {
        tryChangeLang('ru')
    })

    const checkboxes = $All('.checkbox')
    const checkboxTerms = $('.start__terms')
    const checkboxDetectLocation = $('.start__detect_loc')

    const handleCheckbox = (e, target = null) => {
        state.flow.push('hc')
        const input = target || e.currentTarget
        const goal = input.id
        const isEnabled = input.checked

        startScreenState = {
            ...startScreenState,
            [goal]: isEnabled
        }
        console.log(startScreenState)

        if (isEnabled) {
            const houses = $All('.start__house-off')
            if (houses.length === 2)
                removeClass(houses[Math.round(Math.random())], 'start__house-off')
            else
                removeClass(houses[0], 'start__house-off')
        } else {
            const houses = $All('.start__house:not(.start__house-off)')
            if (houses.length === 2)
                addClass(houses[Math.round(Math.random())], 'start__house-off')
            else
                addClass(houses[0], 'start__house-off')
        }

        if (goal === 'detectLoc')
            setCookie('detectLoc', isEnabled ? 1 : 0, 365)
    }

    handleEnterPrevDef(checkboxTerms, e => {
        const checkbox = checkboxTerms.querySelector('.checkbox')
        checkbox.checked = !checkbox.checked;
        handleCheckbox(e, checkbox)
    })
    handleEnterPrevDef(checkboxDetectLocation, e => {
        const checkbox = checkboxDetectLocation.querySelector('.checkbox')
        checkbox.checked = !checkbox.checked;
        handleCheckbox(e, checkbox)
    })

    checkboxes.forEach(item => item.addEventListener('change', e => handleCheckbox(e)))

    const startNoLogin = $('.start__no_login')
    const startLogin = $('.start__login')
    const startRegister = $('.start__register')

    const hideStartScreen = () => {
        if (!startScreenState.terms) {
            alert(
                state.lang === 'en'
                    ? `We can't let you in without agreeing to our terms of use, sorry`
                    : `Для продолжения нужно согласиться с условиями использования`
            )
            return false
        }

        addClass(imageCont, 'start-anim')
        setCookie('visited', 1, 365)
        setTimeout(() => { removeClass(imageCont, 'start-show') }, 2000)
        setTimeout(() => { $('.start').remove() }, 4000)

        if (startScreenState.detectLoc)
            detectLocation()

        // check if user cleared start-screen cookie, but still logged in
        if (state.userID)
            return false

        return true
    }

    const tryOpenLoginForm = async (stage) => {
        state.flow.push(stage === 'register' ? 'ssr' : 'ssl')
        // check if neeeded function exists
        while (typeof openLoginForm !== 'function')
            await sleep(1000)

        openLoginForm(stage)
    }

    handleClickPrevDef(startNoLogin, hideStartScreen)
    handleEnterPrevDef(startNoLogin, hideStartScreen)

    handleClickPrevDef(startLogin, () => {
        const isPossible = hideStartScreen()
        if (!isPossible)
            return

        tryOpenLoginForm()
    })
    handleEnterPrevDef(startLogin, () => {
        const isPossible = hideStartScreen()
        if (!isPossible)
            return

        tryOpenLoginForm()
    })

    handleClickPrevDef(startRegister, () => {
        const isPossible = hideStartScreen()
        if (!isPossible)
            return

        tryOpenLoginForm('register')
    })
    handleEnterPrevDef(startRegister, () => {
        const isPossible = hideStartScreen()
        if (!isPossible)
            return

        tryOpenLoginForm('register')
    })

    const planeWrap = $('.plane__wrap')
    let colorCounter = 1
    handleClickPrevDef(planeWrap, () => {
        addClass(planeWrap, `plane__wrap-clicked_${colorCounter++}`)
    })
}

const checkIsLaunchFirst = () => {
    const isVisited = getCookie('visited')
    const shouldDetectLoc = getCookie('detectLoc')

    if (!isVisited) {
        state.flow.push('ftv')
        console.log('first-time visitor')
        positionStartScreen()
    } else {
        state.flow.push('rv')
        console.log('returning visitor')
        $('.start').remove()
    }

    if (shouldDetectLoc === '1') {
        detectLocation()
    }
}

checkIsLaunchFirst()
