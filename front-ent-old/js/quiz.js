const quizStateDef = {
    curStage: 1,
    comment: null,
    isPersonalExperience: false,
}
const quizRatingDef = {
    air: null,
    water: null,
    logistic: null,
    transport: null,
    noize: null,
    clean: null,
    chill: null,
    safety: null,
    pets: null,
    kids: null,
    parking: null,
}
let quizState = { ...quizStateDef }
let quizRating = { ...quizRatingDef }

const isPersExpBtn = $('.btnPersExp')
const isNotPersExpBtn = $('.btnNotPersExp')
const saveBtn = $('.btnSave')
const ratingComment = $('.ratingComment')
const ratingCount = $('.rating__count')
const closeBtn = $('.ratingShowClose')
const ratingProgr = $('.rating__progr')
const setRatingButtons = $All('.setRating')
const quizNextButtons = $All('.btnNext')
const quizPrevButtons = $All('.btnPrev')
const quizes = $All('.ratingShowPopup')
const saveStatus = $('.rating__status')

const resetQuiz = () => {
    // reset state
    quizState = { ...quizStateDef }
    quizRating = { ...quizRatingDef }
    state = { ...state, corrdsToSave: null }

    // reset DOM
    removeClass(ratingPopup, 'rating-active')
    removeClass(saveStatus, 'rating__status-progress', 'rating__status-error', 'rating__status-rated', 'rating__status-limit', 'rating__status-logout')
    $All('.star-active').forEach(item => removeClass(item, 'star-active'))
    showQuiz()
    ratingComment.value = ''
    ratingCount.textContent = '330'
}

// const setProgrBar = stageNumb => {
//     const level = (stageNumb - 1) / 5 * 100
//     ratingProgr.style.width = `${level}%`
// }

// const hideAllSides = () => {
//     closeSideBar()
//     closeLoginForm()
//     resetQuiz()
//     resetRate()
//     closePlaces()
//     closePartners()
//     closeRateTutorial()
// }

const showQuiz = (stageNumb = 1) => {
    // quizes.forEach(item => removeClass(item, 'rating__popup-active'))
    // removeClass(saveStatus, 'rating__status-more')
    //
    // const nextSlide = $(`.ratingPopup${stageNumb}`)
    // addClass(nextSlide, 'rating__popup-active')
    // setProgrBar(stageNumb)
    nextSlide.focus()
}

// const checkAndGetData = rating => {
//     const { finalRating, answersNumber } = getFinalRating(rating)
//
//     return {
//         isDataValid: answersNumber === 11 ? true : false,
//         averageRating: roundToTen(finalRating)
//     }
// }

const handleQuizBtns = () => {
    // handleClickPrevDef(closeBtn, () => {
    //     hideAllSides()
    // })

    // handleClick(ratingPopup, e => {
    //     if (e.target === e.currentTarget)
    //         hideAllSides()
    // })

    // quizNextButtons.forEach(item => handleClickPrevDef(item, () => {
    //     quizState = { ...quizState, curStage: quizState.curStage + 1 }
    //     showQuiz(quizState.curStage)
    // }))
    //
    // quizPrevButtons.forEach(item => handleClickPrevDef(item, () => {
    //     quizState = { ...quizState, curStage: quizState.curStage - 1 }
    //     showQuiz(quizState.curStage)
    // }))

    // setRatingButtons.forEach(item => handleClickPrevDef(item, e => {
    //     const target = e.currentTarget
    //     const parent = target.parentNode
    //     const ratingName = parent.getAttribute('data-name')
    //     const rating = Number(target.getAttribute('data-rating'))
    //
    //     quizRating = { ...quizRating, [ratingName]: rating }
    //
    //     parent.querySelectorAll('.star').forEach(item => removeClass(item, 'star-active'))
    //     addClass(target, 'star-active')
    //     target.blur()
    // }))

    handleClickPrevDef(isPersExpBtn, () => {
        quizState = { ...quizState, isPersonalExperience: true }
    })

    handleClickPrevDef(isNotPersExpBtn, () => {
        quizState = { ...quizState, isPersonalExperience: false }
    })

    let isSaving = false
    handleClickPrevDef(saveBtn, async () => {
        if (isSaving)
            return

        isSaving = true
        // const { isDataValid, averageRating } = checkAndGetData(quizRating)
        // if (!isDataValid) {
        //     isSaving = false
        //     addClass(saveStatus, 'rating__status-more')
        //     return
        // }

        // TODO: LATER
        // check if data could be irelevant (for example in radius of 1km average rating is 2 points higher)

        // addClass(saveStatus, 'rating__status-progress')
        const actualCoords = [ ...state.corrdsToSave ]

        try {
            // const { error, data } = await saveToDB(actualCoords, quizRating, averageRating, quizState.comment, quizState.isPersonalExperience)
            // if (error === 'Nearby place is already rated') {
            //     removeClass(saveStatus, 'rating__status-progress')
            //     addClass(saveStatus, 'rating__status-rated')
            //     isSaving = false
            //     return
            // } else if (error === 'No active ratings') {
            //     removeClass(saveStatus, 'rating__status-progress')
            //     addClass(saveStatus, 'rating__status-limit')
            //     isSaving = false
            //     return
            // } else if (error === 'User is not logged in') {
            //     userLoggedOut()
            //     state = { ...state, userID: null }
            //     removeClass(saveStatus, 'rating__status-progress')
            //     addClass(saveStatus, 'rating__status-logout')
            //     isSaving = false
            //     return
            // } else if (error) {
            //     removeClass(saveStatus, 'rating__status-progress')
            //     addClass(saveStatus, 'rating__status-error')
            //     isSaving = false
            //     return
            // }

            const isUpdated = data.message === 'Rating updated' ? true : false

            if (isUpdated) {
                const { coords, averageRating } = data
                removePointer(actualCoords)
                addPointer(coords, averageRating)
            } else {
                addPointer(actualCoords, averageRating)
            }

            // TODO LATER:
            // confirmation popup "The rating is 4.3. We have just added it. Thank you."
            state.flow.push('rqs')
            isSaving = false

            setActiveRatings(state.activeRatings - 1)
            hideAllSides()
            showSuccessNotification()
        } catch (e) {
            console.warn(e)
            removeClass(saveStatus, 'rating__status-progress')
            addClass(saveStatus, 'rating__status-error')
        }
    })

    document.addEventListener("keydown", ({key}) => {
        if (key === "Escape")
            hideAllSides()
    })

    ratingComment.addEventListener('input', e => {
        const value = e.target.value
        const remainingCount = 330 - value.length

        ratingCount.textContent = remainingCount
        quizState = { ...quizState, comment: value }
    })
}

handleQuizBtns()
