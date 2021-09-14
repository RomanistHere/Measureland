<script>
    import { _, json } from 'svelte-i18n';

    import PopupWrap from '../PopupWrap.svelte';
    import QuizItem from './QuizItem.svelte';

    import { getSinglePointData } from "../../../../../utilities/api.js";
    import { getFinalRating, roundToTen, openAnotherOverlay } from "../../../../../utilities/helpers.js";
    import { geocodeServiceReference } from "../../../../../../stores/references.js";
    import { userStateStore } from "../../../../../../stores/state.js";

    export let popupData;

    $: errorsObj = $json('errors');
    $: console.log(errorsObj)
    $: criteriaObj = $json('criteria');
    $: criteria = Object.keys(criteriaObj).map((key, i) => ({
        title: criteriaObj[key]['title'],
        tooltip: criteriaObj[key]['tooltip'],
        caption: criteriaObj[key]['caption'],
        rating: null,
        key,
    }));

    $: quizArray = criteria.map(({ title, tooltip, caption, rating, key }) => ({
        title,
        tooltip,
        caption,
        rating,
        key,
    }));

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    $: currentStage = 1;
    $: progressBarClassName = getProgressBarClassName(currentStage);

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
        currentStage++;
        isError = false;
    }
    const prevStage = () => {
        currentStage--;
        isError = false;
    }

    const changePersonalExperience = isPersonalExperience => {
        quizState = {
            ...quizState,
            isPersonalExperience,
        }
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

    const save = async () => {
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

        try {
            const { error, data } = await saveToDB(coords, quizState.ratings, averageRating, quizState.comment, quizState.isPersonalExperience);
            isLoading = false;

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
                errorType = 'unrecognizedError';
                isError = true;
                return;
            }
        } catch (e) {
            console.warn(e);
            errorType = 'unrecognizedError';
            isError = true;
            isLoading = false;
        }
    }
</script>

<PopupWrap className='rating__wrap'>
    <div class="rating__popup rating__popup-active">
        <div class="rating__content">
            {#if currentStage === 1}
                <p class="rating__text">
                    So you want to rate the place. Before we start, there is one important question to answer. We expect an honest answer, thank you!
                </p>
                <p class="rating__text rating__text-italic">
                    Do you have personal experience of living at the given place?
                </p>
                <div class="rating__img_wrap">
                    <img src="images/crowd.png" width="400" height="180" alt="Picture of a crowd looking at you" class="rating__img">
                </div>
            {:else if currentStage === 2}
                <p class="rating__text">
                    Great, thanks. There are about ten criteria you will need to rate in order to submit your rating. You can skip and return later, there is an opportunity to leave a comment at the end. Let's start with <strong class="rating__text-highlight">important</strong>:
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
                <p class="rating__text">
                    <strong class="rating__text-highlight">Location</strong>
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
                <p class="rating__text">
                    <strong class="rating__text-highlight">Comfort</strong>
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
                <p class="rating__text">
                    <strong class="rating__text-highlight">Extras</strong>
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
                <p class="rating__text">
                    <strong class="rating__text-highlight">Comment</strong>
                </p>

                <p class="rating__text">
                    Is there anything you'd like to add?
                </p>

                <textarea class="rating__textarea ratingComment" placeholder="Extremely friendly and clean neighborhood!" maxlength="{maxCommentLength}"></textarea>

                <div class="rating__count_wrap">
                    <span class="rating__count">
                        {maxCommentLength}
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
                Be sincere. Help us and we will help you back!
            </p>
            {#if isUserLoggedIn}
                <div class="rating__btns btns_wrap">
                    <a href="#" class="rating__btn btn" on:click|preventDefault={nextStage} on:click={() => { changePersonalExperience(false) }}>
                        No, I don't
                    </a>
                    <a href="#" class="rating__btn btn" on:click|preventDefault={nextStage} on:click={() => { changePersonalExperience(true) }}>
                        Yes, I lived here
                    </a>
                </div>
            {:else}
                <a href="#" class="rating__login btn" on:click|preventDefault={() => { openAnotherOverlay('loginPopup') }}>Login and rate</a>
            {/if}
        {:else}
            <div class="rating__btns btns_wrap">
                <a href="#" class="rating__btn btn btn-low" on:click|preventDefault={prevStage}>
                    Back
                </a>
                {#if currentStage === 6}
                    <a href="#" class="rating__btn btn" on:click|preventDefault={save}>
                        Save
                    </a>
                {:else}
                    <a href="#" class="rating__btn btn" on:click|preventDefault={nextStage}>
                        Next
                    </a>
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
