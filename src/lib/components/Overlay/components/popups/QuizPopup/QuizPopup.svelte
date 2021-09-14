<script>
    import PopupWrap from '../PopupWrap.svelte';
    import QuizItem from './QuizItem.svelte';

    import { getSinglePointData } from "../../../../../utilities/api.js";
    import { geocodeServiceReference } from "../../../../../../stores/references.js";
    import { userStateStore } from "../../../../../../stores/state.js";

    export let popupData;

    const maxCommentLength = 330;
	const geocodeService = $geocodeServiceReference;
    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    $: currentStage = 1;

    const nextStage = () => currentStage++;
    const prevStage = () => currentStage--;
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
                    title='Air quality'
                    tooltip='Foreign smells (from fields, factories, etc.). How nice to breathe.'
                    key='air'
                    caption='1 - bad, 5 - awesome'
                />

                <QuizItem
                    title='Water quality'
                    tooltip='Water problems (smell, taste, color, itching). How good it is.'
                    key='water'
                    caption='1 - terrible, 5 - good'
                />
            {:else if currentStage === 3}
                <p class="rating__text">
                    <strong class="rating__text-highlight">Location</strong>
                </p>

                <QuizItem
                    title='Basic and social infrastructure'
                    tooltip='The number and quality of shops, cafes, entertainment facilities, hairdressers, gyms, etc. nearby.'
                    key='logistic'
                    caption='1 - awful, 5 - great'
                />

                <QuizItem
                    title='Transport and location conditions'
                    tooltip='How easy it is to get to the needed places by public or personal transport, bicycle, on foot.'
                    key='transport'
                    caption='1 - poor, 5 - nice'
                />

                <QuizItem
                    title='Light and noise pollution'
                    tooltip='How much noise and light disturbs. 1 - disturbs strongly, 5 - does not disturb.'
                    key='noize'
                    caption='1 - noizy, 5 - quietly'
                />
            {:else if currentStage === 4}
                <p class="rating__text">
                    <strong class="rating__text-highlight">Comfort</strong>
                </p>

                <QuizItem
                    title='Cleanliness and tidiness'
                    tooltip='The amount of garbage. Caring for the appearance of the entrances/lawns/areas.'
                    key='clean'
                    caption='1 - dirty, 5 - clean'
                />

                <QuizItem
                    title='Outdoor activities and walks'
                    tooltip='The presence of parks, water, walks and bike paths nearby, as well as their equipment.'
                    key='chill'
                    caption='1 - far, 5 - nearby'
                />

                <QuizItem
                    title='Safety'
                    tooltip='How safe does it feel to live in this area compared to other places.'
                    key='safety'
                    caption='1 - anxious, 5 - calmly'
                />
            {:else if currentStage === 5}
                <p class="rating__text">
                    <strong class="rating__text-highlight">Extras</strong>
                </p>

                <QuizItem
                    title='Life with pets'
                    tooltip='How well tenants treat pets. Walking and training areas. If you have no experience, remember how much pets you have seen here.'
                    key='pets'
                    caption='1 - tough, 5 - easy'
                />

                <QuizItem
                    title='Life with kids'
                    tooltip='Infrastructure for children: kindergartens and playgrounds, schools nearby - and security.'
                    key='kids'
                    caption='1 - rough, 5 - cool'
                />

                <QuizItem
                    title='Parking places'
                    tooltip='Parking space problems. 1 - no places, 5 - no problem.'
                    key='parking'
                    caption='1 - sad, 5 - terrific'
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
                    <div class="rating__status_text">
                        <div class="spinner"></div>
                    </div>
                    <div class="rating__status_text rating__status_text-err">
                        Error, try again later :(
                    </div>
                    <div class="rating__status_text rating__status_text-more">
                        Rate every field please!
                    </div>
                    <div class="rating__status_text rating__status_text-rated">
                        Nearby place is already rated by you
                    </div>
                    <div class="rating__status_text rating__status_text-limit">
                        You rate too often, have to wait. <a href="blog/how-to-become-citizen/" target="_blank" class="rating__link">Why?</a>
                    </div>
                    <div class="rating__status_text rating__status_text-logout">
                        Session expired, please, refresh and login.
                    </div>
                </div>

            {/if}
        </div>

        {#if currentStage === 1}
            <p class="rating__text rating__text-small rating__text-abs">
                Be sincere. Help us and we will help you back!
            </p>
            {#if isUserLoggedIn}
                <div class="rating__btns btns_wrap">
                    <a href="#" class="rating__btn btn" on:click|preventDefault={nextStage}>
                        No, I don't
                    </a>
                    <a href="#" class="rating__btn btn" on:click|preventDefault={nextStage}>
                        Yes, I lived here
                    </a>
                </div>
            {:else}
                <a href="#" class="rating__login btn">Login and rate</a>
            {/if}
        {:else}
            <div class="rating__btns btns_wrap">
                <a href="#" class="rating__btn btn btn-low" on:click|preventDefault={prevStage}>
                    Back
                </a>
                {#if currentStage === 6}
                    <a href="#" class="rating__btn btn btnSave">
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
        <div class="rating__progr"></div>
    </div>
</PopupWrap>
