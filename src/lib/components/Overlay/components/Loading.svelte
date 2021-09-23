<script>
    import { browser } from '$app/env';

    import Spinner from '../../Spinner.svelte';

    import { checkUser } from "../../../utilities/api.js";
    import { getCookie } from "../../../utilities/helpers.js";
    import { userStateStore, appStateStore } from "../../../../stores/state.js";

    let isError = false;
    let errorName = null;
    let isLoaded = false;

    const userInit = async () => {
        const { error, data } = await checkUser();
        console.log(data)

        if (error) {
            console.warn(error);
            isError = true;
            errorName = error;
            if (error === 'Too many requests, please try again later')
                appStateStore.update(state => ({ ...state, shouldWork: false }));

            return;
        }
        const { userID, userName, activeRatings, wantMoreRatings } = data;
        const shouldSendEvent = browser ? getCookie('shouldSendEvent') !== '0' ? true : false : false;
        const shouldShowStartScreen = browser ? getCookie('startScreen') !== '0' ? true : false : false;

        isLoaded = true;
        if (userID) {
            userStateStore.update(state => ({
                ...state,
                userID,
                activeRatings,
                userName,
                wantMoreRatings,
                shouldSendEvent,
            }));
            // for test purposes
            // fillDB(20000)
        }

        if (shouldShowStartScreen)
            appStateStore.update(state => ({ ...state, startScreen: true }));
    }

    let promise = userInit();
</script>

{#if !isLoaded}
    <Spinner className="spinner__main" />

    {#if isError && errorName === 'Too many requests, please try again later'}
        <!-- TODO: check if it's working -->
        <div class="limit_error">
            You have exceeded our limit of requests. There are <a href="blog/how-to-become-citizen/">two options</a>: either you a bad guy who for some reason wants our aimed at helping people service go down or our system being not ideal. We are strongly believe it's a second one. If you <a href="mailto:support@measureland.org">dropped us a message</a> we would have an opportunity to become better. But for now you need to wait a little to enter Measureland again. Sorry for the inconvenience.
        </div>
    {:else if isError}
        <section class="error_screen">
            <span class="error_screen__text">
                Unfortunately, there is no response from the server. Try later or contact us: <a href="mailto:support@measureland.org">support@measureland.org</a>
            </span>
        </section>
    {/if}
{/if}
