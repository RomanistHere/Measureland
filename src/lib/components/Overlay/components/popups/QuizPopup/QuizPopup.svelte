<script>
    import { _, json } from 'svelte-i18n';

    import PopupWrap from '../PopupWrap.svelte';
    import QuizItem from './QuizItem.svelte';
    import SecondaryButton from '../../SecondaryButton.svelte';
    import MainButton from '../../MainButton.svelte';

    import { saveToDB } from "../../../../../utilities/api.js";
    import { getFinalRating, roundToTen, openAnotherOverlay, showSuccessNotification, closeOverlays, roundToFifthDecimal, debounce } from "../../../../../utilities/helpers.js";
    import { geocodeServiceReference } from "../../../../../../stores/references.js";
    import { userStateStore, markerStore } from "../../../../../../stores/state.js";

    export let popupData;

    $: errorsObj = $json('errors');
    $: criteriaObj = $json('criteria');
    $: quizArray = Object.keys(criteriaObj).map((key, i) => ({
        title: criteriaObj[key]['title'],
        tooltip: criteriaObj[key]['tooltip'],
        caption: criteriaObj[key]['caption'],
        rating: null,
        key,
    }));

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    $: currentStage = 1;
    $: progressBarClassName = getProgressBarClassName(currentStage);

    let remainingCommentLength = 330;
    let errorType = null;
    let isLoading = false;
    let isError = false;
    let quizState = {
        ratings: {},
        comment: null,
        isPersonalExperience: false,
    };

    const maxCommentLength = 330;
	const geocodeService = $geocodeServiceReference;

    const nextStage = () => {
        currentStage += 1;
        isError = false;
    }
    const prevStage = () => {
        currentStage -= 1;
        isError = false;
    }

    const updateComment = e => {
        const comment = e.target.value;
        remainingCommentLength = 330 - comment.length;
        quizState = { ...quizState, comment };
    }

    const changePersonalExperience = isPersonalExperience => {
        nextStage();
        quizState = { ...quizState, isPersonalExperience };
    }

    const getProgressBarClassName = stage => {
        if (stage === 1)
            return 'rating__progr-stage1';
        else if (stage === 2)
            return 'rating__progr-stage2';
        else if (stage === 3)
            return 'rating__progr-stage3';
        else if (stage === 4)
            return 'rating__progr-stage4';
        else if (stage === 5)
            return 'rating__progr-stage5';
        else if (stage === 6)
            return 'rating__progr-stage6';
    }

    const setRating = event => {
        const { key, rating } = event.detail;
        for (let i = 0; i < quizArray.length; i++) {
            const item = quizArray[i];
            if (item.key === key)
                item.rating = rating;
        }

        quizState = {
            ...quizState,
            ratings: {
                ...quizState.ratings,
                [key]: rating
            }
        }
    }

    const checkAndGetData = rating => {
        const { finalRating, answersNumber } = getFinalRating(rating)

        return {
            isDataValid: answersNumber === 11 ? true : false,
            averageRating: roundToTen(finalRating)
        }
    }

    const submit = async () => {
        errorType = null;
        isError = false;
        isLoading = true;
        const { isDataValid, averageRating } = checkAndGetData(quizState.ratings);
        if (!isDataValid) {
            // TODO: later forward to non rated field
            errorType = 'rateEveryField';
            isLoading = false;
            isError = true;
            return
        }

        const currentCoords = [roundToFifthDecimal(popupData.lat), roundToFifthDecimal(popupData.lng)];

        try {
            const { error, data } = await saveToDB(currentCoords, quizState.ratings, averageRating, quizState.comment, quizState.isPersonalExperience);
            isLoading = false;
            console.log(error, data)

            if (error === 'Nearby place is already rated') {
                errorType = 'nearbyPlaceAlreadyRated';
                isError = true;
                return;
            } else if (error === 'No active ratings') {
                errorType = 'youRateTooOften';
                isError = true;
                return;
            } else if (error === 'User is not logged in') {
                errorType = 'sessionExpired';
                isError = true;
                return;
            } else if (error) {
                console.warn(error);
                errorType = 'unrecognizedError';
                isError = true;
                return;
            }

            const isUpdated = data.message === 'Rating updated' ? true : false;
            if (isUpdated) {
                const { coords, averageRating } = data;
                markerStore.update(state => ({
                    ...state,
                    markersToRemove: [ ...state.markersToRemove, { coords: currentCoords } ],
                    markersToAdd: [ ...state.markersToAdd, { coords, rating: averageRating } ],
                }));
            } else {
                markerStore.update(state => ({
                    ...state,
                    markersToAdd: [ ...state.markersToAdd, { coords: currentCoords.reverse(), rating: averageRating } ],
                }));
            }

            userStateStore.update(state => ({ ...state, activeRatings: state.activeRatings - 1 }));
            closeOverlays();
            showSuccessNotification();
        } catch (e) {
            console.warn(e);
            errorType = 'unrecognizedError';
            isError = true;
            isLoading = false;
        }
    }

    const debouncedSubmit = debounce(submit, 300);
</script>

<PopupWrap className='rating__wrap'>
    <div class="rating__popup rating__popup-active">
        <div class="rating__content">
            {#if currentStage === 1}
                <p class="rating__text my-4">
                    {$_('quizPopup.soYouWantToRate')}
                </p>
                <p class="rating__text rating__text-italic my-4">
                    {$_('quizPopup.doYouHavePersonalExperience')}
                </p>
                <div class="rating__img_wrap">
                    <img src="images/crowd.png" width="400" height="180" alt="{$_('quizPopup.imageTitle')}" class="rating__img">
                </div>
            {:else if currentStage === 2}
                <p class="rating__text my-4">
                    {$_('quizPopup.tenCriteria')}
                    <strong class="rating__text-highlight">{$_('quizPopup.tenCriteriaStrong')}</strong>:
                </p>

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[0] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[1] }
                />
            {:else if currentStage === 3}
                <p class="rating__text my-4">
                    <strong class="rating__text-highlight">{$_('quizPopup.title3')}</strong>
                </p>

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[2] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[3] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[4] }
                />
            {:else if currentStage === 4}
                <p class="rating__text my-4">
                    <strong class="rating__text-highlight">{$_('quizPopup.title4')}</strong>
                </p>

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[5] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[6] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[7] }
                />
            {:else if currentStage === 5}
                <p class="rating__text my-4">
                    <strong class="rating__text-highlight">{$_('quizPopup.title5')}</strong>
                </p>

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[8] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[9] }
                />

                <QuizItem
                    on:setRating={setRating}
                    { ...quizArray[10] }
                />
            {:else if currentStage === 6}
                <p class="rating__text my-4">
                    <strong class="rating__text-highlight">{$_('quizPopup.title6')}</strong>
                </p>

                <p class="rating__text">
                    {$_('quizPopup.isThereAnythingToAdd')}
                </p>

                <textarea
                    class="rating__textarea ratingComment"
                    placeholder="{$_('quizPopup.textAreaPlaceholder')}"
                    maxlength="{maxCommentLength}"
                    on:input={updateComment}
                ></textarea>

                <div class="rating__count_wrap">
                    <span class="rating__count">
                        {remainingCommentLength}
                    </span>
                </div>

                <div class="rating__status">
                    {#if isLoading}
                        <div class="spinner"></div>
                    {:else if isError && errorType === 'youRateTooOften'}
                        <div class="rating__status_text">
                            {$_('errors.youRateTooOften')} <a href="blog/how-to-become-citizen/" target="_blank" class="rating__link">{$_('errors.youRateTooOftenLink')}</a>
                        </div>
                    {:else if isError}
                        <div class="rating__status_text">
                            {errorsObj[errorType]}
                        </div>
                    {/if}
                </div>

            {/if}
        </div>

        {#if currentStage === 1}
            <p class="rating__text rating__text-small rating__text-abs">
                {$_('quizPopup.beSincere')}
            </p>
            {#if isUserLoggedIn}
                <div class="rating__btns btns_wrap">
                    <MainButton
                        action={() => { changePersonalExperience(false) }}
                        className='rating__btn'
                        text={$_('quizPopup.noPersonalExperienceBtn')}
                    />
                    <MainButton
                        action={() => { changePersonalExperience(true) }}
                        className='rating__btn'
                        text={$_('quizPopup.yesPersonalExperienceBtn')}
                    />
                </div>
            {:else}
                <MainButton
                    action={() => { openAnotherOverlay('loginPopup') }}
                    className='rating__login d-b'
                    text={$_('quizPopup.loginBtn')}
                />
            {/if}
        {:else}
            <div class="rating__btns btns_wrap">
                <SecondaryButton
                    action={prevStage}
                    className='rating__btn'
                    text={$_('quizPopup.backBtn')}
                />
                {#if currentStage === 6}
                    <MainButton
                        action={debouncedSubmit}
                        className='rating__btn'
                        text={$_('quizPopup.submitBtn')}
                    />
                {:else}
                    <MainButton
                        action={nextStage}
                        className='rating__btn'
                        text={$_('quizPopup.nextBtn')}
                    />
                {/if}
            </div>
        {/if}
    </div>

    <div class="rating__progr_wrap">
        <div class="rating__progr {progressBarClassName}"></div>
    </div>
</PopupWrap>

<style>
    .rating__status {
        opacity: 1;
    }

    .rating__progr-stage1 {
        width: 0;
    }

    .rating__progr-stage2 {
        width: 20%;
    }

    .rating__progr-stage3 {
        width: 40%;
    }

    .rating__progr-stage4 {
        width: 60%;
    }

    .rating__progr-stage5 {
        width: 80%;
    }

    .rating__progr-stage6 {
        width: 100%;
    }
</style>
