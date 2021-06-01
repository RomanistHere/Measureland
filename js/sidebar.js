const closeSideBarBtn = $('.sidebarClose')
const commentsWrap = $('.comments__wrap')
const openSettingsBtn = $('.open_settings')
const changeLangBtn = $('.changeLangBtn')
const textAreaComment = $('.ratingComment')
const openLoginBtn = $('.loginBtn')
const changePassBtn = $('.changePass')
const myRatingsBtn = $('.myRatings')

const changeLang = lang => {
    state.flow.push('cl')
    
    console.log(window.location)
    console.log(state.lang)
    console.log(lang)

    if (state.lang === lang)
        return

    if (lang === 'en') {
        window.location.pathname = '/'
    } else {
        window.location.pathname = '/ru/'
    }
}

const openSideBar = (className = 'settings') => {
    $All('.sidebar__section').forEach(elem => removeClass(elem, 'sidebar__section-show'))
    addClass($(`.${className}`), 'sidebar__section-show')

    addClass(document.body, 'sidebar-open')
    state.flow.push('os')
}

const closeSideBar = () => {
    state.flow.push('cs')
    removeClass(document.body, 'sidebar-open')
    hideSpinner('.sidebar__spinner')
    commentsWrap.textContent = ''
}

const initSideBar = () => {
    handleClickPrevDef(closeSideBarBtn, closeSideBar)

    handleClickPrevDef(openLoginBtn, () => {
        hideAllSides()
        openLoginForm()
    })

    handleClickPrevDef(openSettingsBtn, () => {
        openSideBar()
    })

    handleClickPrevDef(changePassBtn, () => {
        hideAllSides()
        openLoginForm('forgot')
    })

    handleClickPrevDef(myRatingsBtn, () => {
        hideAllSides()
        openMyPlaces()
    })

    handleClickPrevDef(changeLangBtn, async () => {
        const newLang = state.lang === 'en' ? 'ru' : 'en'

        if (!state.userID) {
            changeLang(newLang)
        } else {
            const result = await saveLang(newLang)
            changeLang(newLang)
        }
    })
}

initSideBar()

const getCommentHtml = ({ isYours, isLiked, isDisliked, rating, comment, username, liked, disliked, id }) => {
    return `<li class="comments__item ${isYours ? 'comments__item-highlight' : ''}">
        <p class="comments__name rating__title">
            ${username}
            <span class="comments__rating">${state.lang === 'en' ? 'gave' : 'поставил/а'} ${rating}</span>
        </p>
        <p class="comments__text">${comment}</p>
        <div class="comments__btns">
            <a href="#" class="comment__btn" data-goal="like" data-key="${id}" data-disabled="${isLiked || isYours}">
                <span class="comment__btn-emoj">👍</span>
                <span class="comment__btn-numb">${liked}</span>
            </a>
            <a href="#" class="comment__btn" data-goal="dislike" data-key="${id}" data-disabled="${isDisliked || isYours}">
                <span class="comment__btn-emoj">👎</span>
                <span class="comment__btn-numb">${disliked}</span>
            </a>
        </div>
    </li>`
}

const appendComments = array => {
    const list = array.map(item => getCommentHtml(item))
    commentsWrap.insertAdjacentHTML("afterbegin", list.join(''))

    commentsWrap.querySelectorAll('.comment__btn').forEach(item => handleClickPrevDef(item, async (e) => {
        if (!state.userID) {
            openLoginForm()
            return
        }

        const target = e.currentTarget
        const { goal, disabled, key } = target.dataset

        if (disabled !== 'false') {
            return
        }
        // TODO: check if user is logged in, if no tell him to do so
        const anotherBtnQuery = goal === 'like' ? 'dislike' : 'like'
        const anotherBtn = target.parentNode.querySelector(`.comment__btn[data-goal=${anotherBtnQuery}]`)
        if (anotherBtn.dataset.disabled === 'true') {
            anotherBtn.dataset.disabled = false
            const numberElem = anotherBtn.querySelector('.comment__btn-numb')
            numberElem.textContent = Number(numberElem.textContent) - 1
        }

        target.dataset.disabled = true
        const numberElem = target.querySelector('.comment__btn-numb')
        numberElem.textContent = Number(numberElem.textContent) + 1
        const result = await reactOnComment(goal, key)
        console.log(result)
    }))
}

const showComments = async ({ geoID }) => {
    runSpinner('.sidebar__spinner')
    openSideBar('comments')

    const data = await fetchComments(geoID)
    console.log(data)

    appendComments(data)
    hideSpinner('.sidebar__spinner')
}
