const loginCloseBtn = $('.loginClose')
const openRegisterBtn = $('.openRegister')
const openRegisterBtn2 = $('.openRegister2')
const openLoginFormBtn = $('.openLogin')
const onenLoginFormBtn2 = $('.login__recover')
const openForgotPassBtn = $('.openForgotPass')
const logoutBtn = $('.logoutBtn')
const confirmBtn = $('.confirm__btn')
const reverifyBtn = $('.login__reverify')
const loginForm = $('.login')
const loginScreens = $All('.loginPopup')
const togglePassBtns = $All('.togglePass')
const emailInputs = $All('.inputEmail')
const passwordInputs = $All('.inputPass')
const inputPassDouble = $All('.inputPassDouble')
const openLoginFromRatingsBtns = $All('.openLoginFromRatings')

const signInForm = $('#loginForm')
const registerForm = $('#registerForm')
const forgotPassForm = $('#forgotPassForm')
const resetPasswordForm = $('#resetPasswordForm')
const logInBtn = $('#logInBtn')
const registerBtn = $('#registerBtn')
const forgotPassBtn = $('#forgotPassBtn')
const changePasswordBtn = $('#changePasswordBtn')

const loginStateDef = {
    isPassValid: false,
    pass: null,
    isEmailValid: false,
    email: null,
    stage: 'login',
    doublePassIDs: [],
}

let loginState = { ...loginStateDef }

const onboardingStateDef = {
    name: null,
    ageGrp: 1,
    moneyGrp: 1
}

let onboardingState = { ...onboardingStateDef }

const getActiveLoginScreen = stage => {
    if (stage === 'login')
        return loginForm.querySelector('.loginPopup1')
    else if (stage === 'register')
        return loginForm.querySelector('.loginPopup2')
    else if (stage === 'forgot')
        return loginForm.querySelector('.loginPopup3')
    else if (stage === 'loggedIn')
        return loginForm.querySelector('.loginPopup4')
    else if (stage === 'onboarding')
        return loginForm.querySelector('.loginPopup5')
    else if (stage === 'check')
        return loginForm.querySelector('.loginPopup6')
    else if (stage === 'resetPassword')
        return loginForm.querySelector('.loginPopup7')
    else if (stage === 'confirmForgotPassword')
        return loginForm.querySelector('.loginPopup8')
}

const changeLoginScreen = (stage = 'login') => {
    loginScreens.forEach(elem => removeClass(elem, 'rating__popup-active'))

    const activeLoginScren = getActiveLoginScreen(stage)
    const popupWrap = activeLoginScren.parentNode
    popupWrap.classList.remove(
        'login__wrap-register',
        'login__wrap-forgot',
        'login__wrap-onboarding',
        'login__wrap-check',
        'login__wrap-reset'
    )

    if (stage === 'register')
        addClass(popupWrap, 'login__wrap-register')
    else if (stage === 'forgot')
        addClass(popupWrap, 'login__wrap-forgot')
    else if (stage === 'onboarding')
        addClass(popupWrap, 'login__wrap-onboarding')
    else if (stage === 'check' || stage === 'confirmForgotPassword')
        addClass(popupWrap, 'login__wrap-check')
    else if (stage === 'resetPassword')
        addClass(popupWrap, 'login__wrap-reset')

    addClass(activeLoginScren, 'rating__popup-active')

    if (stage === 'loggedIn' || stage === 'onboarding' || stage === 'check' || stage === 'confirmForgotPassword')
        return

    activeLoginScren.querySelector('input').focus()

    loginState = { ...loginState, stage: stage }
}

const openLoginForm = stage => {
    changeLoginScreen(stage)
    addClass(loginForm, 'rating-active')
}

const closeLoginForm = () => {
    removeClass(loginForm, 'rating-active')
    changeLoginScreen()
}

const validateEmail = email =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)

const validatePass = pass =>
    pass.length > 6 && pass.length < 255

const removeLoginErrors = () => {
    const notificationLogin = $('.login__notifications_wrap')
    notificationLogin.classList.remove(
        'login__notifications_wrap-err',
        'login__notifications_wrap-fill',
        'login__notifications_wrap-verify',
        'login__notifications_wrap-timeout',
        'login__notifications_wrap-wrong_pass',
        'login__notifications_wrap-email_not_exist'
    )

    const notificationRegister = $('.register__notifications_wrap')
    notificationRegister.classList.remove(
        'register__notifications_wrap-err',
        'register__notifications_wrap-fill',
        'register__notifications_wrap-timeout',
        'register__notifications_wrap-email_exists'
    )

    const notificationReset = $('.reset__notifications_wrap')
    notificationReset.classList.remove(
        'reset__notifications_wrap-err',
        'reset__notifications_wrap-fill'
    )

    const notificationForgot = $('.forgot__notifications_wrap')
    notificationForgot.classList.remove(
        'forgot__notifications_wrap-err',
        'forgot__notifications_wrap-fill',
        'forgot__notifications_wrap-timeout',
        'forgot__notifications_wrap-old_pass',
        'forgot__notifications_wrap-email_not_exist'
    )
}

const clearLoginFields = () => {
    // reset DOM
    passwordInputs.forEach(item => {
        const errElem = item.parentNode.querySelector('.form__error')
        item.value = ''

        removeClass(item, 'form__input-error')
        removeClass(errElem, 'form__error-show')
        removeClass(item, 'form__input-success')
    })
    emailInputs.forEach(item => {
        const errElem = item.parentNode.querySelector('.form__error')
        item.value = ''

        removeClass(item, 'form__input-error')
        removeClass(errElem, 'form__error-show')
        removeClass(item, 'form__input-success')
    })
    removeLoginErrors()

    // reset state
    loginState = { ...loginStateDef }
}

const onboardingInit = () => {
    $('#age-select').addEventListener('change', e => {
        const grp = Number(e.target.value)
        onboardingState = { ...onboardingState, ageGrp: grp }
    })

    $('#money-select').addEventListener('change', e => {
        const grp = Number(e.target.value)
        onboardingState = { ...onboardingState, moneyGrp: grp }
    })

    $('#username').addEventListener('input', e => {
        const value = e.currentTarget.value
        onboardingState = { ...onboardingState, name: value }
    })
}

const clearURLParams = () => {
    try {
        const url = new URL(window.location.href)
        url.searchParams.delete('reset_pass_token')
        url.searchParams.delete('token')
        url.searchParams.delete('lang')
        window.history.replaceState(null, null, url)
    } catch (e) {
        console.log(e)
    }

    state = {
        ...state,
        passToken: null
    }
}

const verificationInit = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const lang = urlParams.get('lang')
    const passToken = urlParams.get('reset_pass_token')

    if (token) {
        const { error, data } = await verifyUser(token)
        console.log(error, data)

        if (!error) {
            const { userID } = data
            state = { ...state, userID }
            openLoginForm()
            changeLoginScreen('onboarding')
        } else {
            console.warn('Token might be expired')
            showError('unrecognizedError', error)
        }

        // if (state.lang !== lang) {
        //     state = { ...state, lang }
        //     changeLang(state.lang)
        // }

        clearURLParams()
    } else if (passToken && passToken.length >= 25) {
        state = { ...state, passToken }
        openLoginForm()
        changeLoginScreen('resetPassword')
    }
}

const userLoggedIn = () => {
    state.flow.push('li')
    const loggedInBtns = $All('.loggedInShow')
    loggedInBtns.forEach(item => addClass(item, 'loggedInShow-show'))
    const loggedOutBtns = $All('.loggedOutShow')
    loggedOutBtns.forEach(item => removeClass(item, 'loggedOutShow-show'))
}

const userLoggedOut = () => {
    const loggedInBtns = $All('.loggedInShow')
    loggedInBtns.forEach(item => removeClass(item, 'loggedInShow-show'))
    const loggedOutBtns = $All('.loggedOutShow')
    loggedOutBtns.forEach(item => addClass(item, 'loggedOutShow-show'))
}

const userInit = async () => {
    const { error, data } = await checkUser()
    console.warn('__________init_user________')
    console.log(data)
    if (error === 'Too many requests, please try again later') {
        blockMap()
        showLimitError()
        return
    } else if (error) {
        console.warn(error)
        if ($('.start'))
            $('.start').remove()
        showErrorScreen()
        return
    }

    const { userID, userName, lang, dateCreated } = data
    const prevLang = state.lang
    if (userID) {
        state = {
            ...state,
            userID,
            userName,
            dateCreated,
            lang
        }
        console.log(state.lang)
        userLoggedIn()
        console.log('days since register: ', dateDiffInDays(Date.now(), dateCreated))
        // fillDB(20000)
    } else {
        userLoggedOut()
        state = {
            ...state,
            lang: detectPrefLang()
        }
    }

    document.querySelector('.spinner__main').remove()
    console.log(state)
}

const initLoginBtns = () => {
    // login timeout
    const logTimeout = 500
    // register timeout
    const regTimeout = 5000
    // reset password timeout
    const forgTimeout = 20000

    handleClickPrevDef(loginCloseBtn, closeLoginForm)
    handleClickPrevDef(logoutBtn, async () => {
        const { error, data } = await logout()

        if (!error) {
            state.flow.push('lo')
            userLoggedOut()
            state = { ...state, userID: null }
            showSuccessNotification()
        } else {
            showError('unrecognizedError', error)
        }
    })

    handleClickPrevDef(openRegisterBtn, () => { changeLoginScreen('register') })
    handleClickPrevDef(openRegisterBtn2, () => { changeLoginScreen('register') })
    handleClickPrevDef(openLoginFormBtn, () => { changeLoginScreen('login') })
    handleClickPrevDef(onenLoginFormBtn2, () => { changeLoginScreen('login') })
    handleClickPrevDef(openForgotPassBtn, () => { changeLoginScreen('forgot') })

    handleClick(loginForm, e => {
        if (e.target === e.currentTarget)
            hideAllSides()
    })

    openLoginFromRatingsBtns.forEach(item => handleClickPrevDef(item, () => {
        hideAllSides()
        openLoginForm()
    }))

    togglePassBtns.forEach(elem => handleClickPrevDef(elem, e => {
        const inpID = e.currentTarget.parentNode.htmlFor
        const input = $(`#${inpID}`)
        const inputType = input.type

        if (inputType === 'password')
            input.type = 'text'
        else
            input.type = 'password'
    }))

    // inputs

    emailInputs.forEach(input => {
        input.addEventListener('blur', e => {
            const target = e.currentTarget
            const errElem = target.parentNode.querySelector('.form__error')
            const email = target.value.toLowerCase()
            const isValid = validateEmail(email)

            if (isValid) {
                addClass(target, 'form__input-filled')
                addClass(target, 'form__input-success')
                removeClass(target, 'form__input-error')
                removeClass(errElem, 'form__error-show')

                loginState = { ...loginState, isEmailValid: true, email: email }
            } else {
                removeClass(target, 'form__input-filled')
                removeClass(target, 'form__input-success')
                addClass(target, 'form__input-error')
                addClass(errElem, 'form__error-show')

                loginState = { ...loginState, isEmailValid: false }
            }
        })

        input.addEventListener('input', e => {
            const target = e.currentTarget
            const errElem = target.parentNode.querySelector('.form__error')

            removeClass(target, 'form__input-error')
            removeClass(errElem, 'form__error-show')
            removeClass(target, 'form__input-success')
            removeLoginErrors()
        })
    })

    passwordInputs.forEach(input => {
        input.addEventListener('blur', e => {
            const target = e.currentTarget
            const errElem = target.parentNode.querySelector('.form__error')
            const errElem2 = target.parentNode.querySelector('.form__error-passw')
            const password = target.value
            const isValid = validatePass(password)

            const resolvePassInputs = (inp1, inp2, inp1Err, inp2Err) => {
                removeClass(inp1, 'form__input-error')
                removeClass(inp2, 'form__input-error')
                removeClass(inp1Err, 'form__error-show')
                removeClass(inp2Err, 'form__error-show')
                addClass(inp1, 'form__input-success')
                addClass(inp2, 'form__input-success')
            }

            if (isValid) {
                addClass(target, 'form__input-filled')
                addClass(target, 'form__input-success')
                removeClass(target, 'form__input-error')
                removeClass(errElem, 'form__error-show')

                if (loginState.stage !== 'register' && loginState.stage !== 'resetPassword') {
                    loginState = { ...loginState, isPassValid: true, pass: password }
                    return
                }

                if (loginState.doublePassIDs.length !== 2) {
                    loginState = { ...loginState, isPassValid: false }
                    return
                }

                // TODO: change
                const inp1 = loginState.stage === 'register' ? $('#new-password') : $('#new-password-reset')
                const inp2 = loginState.stage === 'register' ? $('#repeat-new-password') : $('#repeat-new-password-reset')
                const anotherInp = target === inp1 ? inp2 : inp1
                const anotherInpErrorElem = anotherInp.parentNode.querySelector('.form__error-passw')

                if (((target.id === 'new-password' || target.id === 'new-password-reset') && inp2.value !== password)
                    || ((target.id === 'repeat-new-password' || target.id === 'repeat-new-password-reset') && inp1.value !== password)) {
                    removeClass(target, 'form__input-success')
                    removeClass(anotherInp, 'form__input-success')
                    addClass(target, 'form__input-error')
                    addClass(anotherInp, 'form__input-error')
                    addClass(errElem2, 'form__error-show')
                    addClass(anotherInpErrorElem, 'form__error-show')

                    loginState = { ...loginState, isPassValid: false }
                } else {
                    resolvePassInputs(inp1, inp2, errElem2, anotherInpErrorElem)

                    loginState = { ...loginState, isPassValid: true, pass: password }
                }
            } else {
                removeClass(target, 'form__input-filled')
                removeClass(target, 'form__input-success')
                addClass(target, 'form__input-error')
                addClass(errElem, 'form__error-show')

                loginState = { ...loginState, isPassValid: false }
            }
        })

        input.addEventListener('input', e => {
            const target = e.currentTarget
            const curItemID = target.id
            const errElem = target.parentNode.querySelector('.form__error')

            removeClass(target, 'form__input-error')
            removeClass(errElem, 'form__error-show')
            removeClass(target, 'form__input-success')
            removeLoginErrors()

            if (!loginState.doublePassIDs.includes(curItemID) && (loginState.stage === 'register' || loginState.stage === 'resetPassword'))
                loginState = { ...loginState, doublePassIDs: [ ...loginState.doublePassIDs, curItemID ] }
        })
    })

    onboardingInit()
    verificationInit()
    userInit()

    // form submits

    handleClickPrevDef(confirmBtn, () => {
        openLoginForm()
        hideAllSides()
    })

    handleClickPrevDef(reverifyBtn, async () => {
        const notification = $('.login__notifications_wrap')
        if (!loginState.isEmailValid) {
            $('#current-email').focus()
            return
        }
        runSpinner('.login__spinner')
        removeLoginErrors()
        console.log(loginState.email)
        const { error, data } = await reverify(loginState.email)
        console.log(error, data)
        hideSpinner('.login__spinner')

        if (error === null) {
            clearLoginFields()
            changeLoginScreen('check')
        } if (error === 'Email is wrong') {
            addClass(notification, 'login__notifications_wrap-email_not_exist')
        } else if (error === 'Already verified') {
            addClass(notification, 'login__notifications_wrap-already_verified')
        } else {
            addClass(notification, 'login__notifications_wrap-err')
        }
    })

    let loginTimeout = null
    let loginTimeoutBool = false

    signInForm.addEventListener('submit', async (e) => {
        const notification = $('.login__notifications_wrap')
        console.log(loginState)

        e.preventDefault()
        removeLoginErrors()
        logInBtn.focus()

        if (!loginState.isPassValid || !loginState.isEmailValid) {
            addClass(notification, 'login__notifications_wrap-fill')

            if (!loginState.isEmailValid)
                $('#current-email').focus()
            else if (!loginState.isPassValid)
                $('#current-password').focus()

            return
        }

        if (loginTimeoutBool) {
            clearTimeout(loginTimeout)
            addClass(notification, 'login__notifications_wrap-timeout')
            loginTimeout = setTimeout(() => {
                loginTimeoutBool = false
            }, logTimeout)
            return
        } else {
            loginTimeoutBool = true
            loginTimeout = setTimeout(() => {
                loginTimeoutBool = false
            }, logTimeout)
        }

        runSpinner('.login__spinner')

        const { error, data } = await login(loginState.email, loginState.pass)
        console.warn('logged in')
        console.log(error)
        console.log(data)
        hideSpinner('.login__spinner')

        if (error === null) {
            state = { ...state, userID: data.userID }
            $('.ratingAvailableNumber').textContent = data.activeRatings != null ? data.activeRatings + 1 : 0
            $('.ratingUserName').textContent = data.userName
            clearLoginFields()
            userLoggedIn()
            changeLoginScreen('loggedIn')
            showSuccessNotification()
        } else if (error === 'Email is wrong') {
            addClass(notification, 'login__notifications_wrap-email_not_exist')
        } else if (error === 'User is not verified') {
            addClass(notification, 'login__notifications_wrap-verify')
        } else if (error === 'Password is wrong') {
            addClass(notification, 'login__notifications_wrap-wrong_pass')
        } else if (error === 'Too many requests, please try again later') {
            addClass(notification, 'login__notifications_wrap-timeout')
        } else {
            addClass(notification, 'login__notifications_wrap-err')
        }
    })

    let registerTimeout = null
    let registerTimeoutBool = false

    registerForm.addEventListener('submit', async (e) => {
        const notification = $('.register__notifications_wrap')
        console.log(loginState)

        e.preventDefault()
        removeLoginErrors()
        registerBtn.focus()

        if (!loginState.isPassValid || !loginState.isEmailValid || loginState.doublePassIDs.length !== 2) {
            addClass(notification, 'register__notifications_wrap-fill')

            if (!loginState.isEmailValid)
                $('#new-email').focus()
            else if (!loginState.isPassValid)
                $('#new-password').focus()
            else if (loginState.doublePassIDs.length !== 2)
                $('#repeat-new-password').focus()

            return
        }

        if (registerTimeoutBool) {
            clearTimeout(registerTimeout)
            addClass(notification, 'register__notifications_wrap-timeout')
            registerTimeout = setTimeout(() => {
                registerTimeoutBool = false
            }, regTimeout)
            return
        } else {
            registerTimeoutBool = true
            registerTimeout = setTimeout(() => {
                registerTimeoutBool = false
            }, regTimeout)
        }

        runSpinner('.register__spinner')

        const { error, data } = await register(loginState.email, loginState.pass, state.lang)
        console.log(error)
        console.log(data)
        hideSpinner('.register__spinner')

        if (error === null) {
            console.log('Registered')
            // state = { ...state, userID: data.userID }
            clearLoginFields()
            changeLoginScreen('check')
            showSuccessNotification()
        } else if (error === 'Email already exists') {
            addClass(notification, 'register__notifications_wrap-email_exists')
        } else if (error === 'Too many requests, please try again later') {
            addClass(notification, 'register__notifications_wrap-timeout')
        } else {
            addClass(notification, 'register__notifications_wrap-err')
        }
    })

    onboardingForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const { name, ageGrp, moneyGrp } = onboardingState
        const userName = name === null || name.trim() === ''
            ? state.lang === 'en'
                ? 'Anonym'
                : 'Аноним'
            : name

        if (userName === 'Anonym' && ageGrp === 1 && moneyGrp === 1) {
            closeLoginForm()
            onboardingState = { ...onboardingStateDef }
            showSuccessNotification()
            userLoggedIn()
            return
        }

        const { error } = await onboard(userName, ageGrp, moneyGrp, state.userID)
        console.log(error)

        if (error) {
            showError('unrecognizedError', error)
            return
        }

        closeLoginForm()
        onboardingState = { ...onboardingStateDef }
        showSuccessNotification()
        userLoggedIn()
    })

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log(state)
        console.log(loginState)

        const notification = $('.reset__notifications_wrap')
        removeLoginErrors()
        changePasswordBtn.focus()

        if (!loginState.isPassValid || loginState.doublePassIDs.length !== 2) {
            addClass(notification, 'reset__notifications_wrap-fill')

            if (!loginState.isPassValid)
                $('#new-password-reset').focus()
            else if (loginState.doublePassIDs.length !== 2)
                $('#repeat-new-password-reset').focus()

            return
        }
        runSpinner('.reset__spinner')

        const { error, data } = await reset(loginState.pass, state.passToken)
        console.log(error)
        console.log(data)
        hideSpinner('.reset__spinner')

        if (error === null) {
            state.flow.push('pr')
            console.log('Password reset')
            // state = { ...state, userID: data.userID }
            closeLoginForm()
            clearLoginFields()
            clearURLParams()
            showSuccessNotification()
        } else if (error === 'Matches old password') {
            addClass(notification, 'reset__notifications_wrap-old_pass')
        } else if (error === 'Password link is invalid or expired') {
            addClass(notification, 'reset__notifications_wrap-expired')
        }  else {
            addClass(notification, 'reset__notifications_wrap-err')
        }
    })

    let resetTimeout = null
    let resetTimeoutBool = false

    forgotPassForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log(state)
        console.log(loginState)

        const notification = $('.forgot__notifications_wrap')
        removeLoginErrors()
        forgotPassBtn.focus()

        if (!loginState.isEmailValid) {
            addClass(notification, 'forgot__notifications_wrap-fill')
            $('#old-email-restore').focus()

            return
        }

        if (resetTimeoutBool) {
            clearTimeout(resetTimeout)
            addClass(notification, 'forgot__notifications_wrap-timeout')
            resetTimeout = setTimeout(() => {
                resetTimeoutBool = false
            }, forgTimeout)
            return
        } else {
            resetTimeoutBool = true
            resetTimeout = setTimeout(() => {
                resetTimeoutBool = false
            }, forgTimeout)
        }

        runSpinner('.forgot__spinner')

        const { error, data } = await sendResetPass(loginState.email)
        console.log(error)
        console.log(data)
        hideSpinner('.forgot__spinner')

        if (error === null) {
            console.log('Password reset')
            state.flow.push('fp')
            // state = { ...state, userID: data.userID }
            clearLoginFields()
            clearURLParams()
            changeLoginScreen('confirmForgotPassword')
            showSuccessNotification()
        } else if (error === 'Too many requests, please try again later') {
            addClass(notification, 'forgot__notifications_wrap-timeout')
        }  else if (error === 'Email is wrong') {
            addClass(notification, 'forgot__notifications_wrap-email_not_exist')
        } else {
            addClass(notification, 'forgot__notifications_wrap-err')
        }
    })
}

initLoginBtns()
