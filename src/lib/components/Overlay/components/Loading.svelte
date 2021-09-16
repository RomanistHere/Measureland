<script>
    import { checkUser } from "../../../utilities/api.js";
    import { userStateStore, appStateStore } from "../../../../stores/state.js";
    import Spinner from '../../Spinner.svelte';

    let isError = false;
    let errorName = null;
    let isLoaded = false;

    const userInit = async () => {
        const { error, data } = await checkUser();

        console.log(error)
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

        isLoaded = true;
        if (userID) {
            userStateStore.update(state => ({
                ...state,
                userID,
                activeRatings,
                userName,
                wantMoreRatings
            }));
            // for test purposes
            // fillDB(20000)
        }
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
