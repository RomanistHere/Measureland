<script>
    import { browser } from '$app/env';
    import { _ } from 'svelte-i18n';

    import Spinner from '../../Spinner.svelte';
    import TextLink from '../../TextLink.svelte';

    import { checkUser } from "../../../utilities/api.js";
    import { getCookie } from "../../../utilities/helpers.js";
    import { userStateStore, appStateStore } from "../../../../stores/state.js";
    import { appInfo } from '../../../../configs/index.js';

    let isError = false;
    let isLoaded = false;

    const userInit = async () => {
        const { error, data } = await checkUser();
        console.log(data)

        if (error) {
            console.warn(error);
            isError = true;
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
    <Spinner className="fixed z-3 inset-0 {$appStateStore.startScreen && 'right-1/2'}" />

    {#if isError}
        <section class="absolute z-4 flex justify-center items-center inset-0 {$appStateStore.startScreen && 'right-1/2'}">
            <span class="text-xl pt-64">
                {$_('errors.noResponseFromServer')}
                <TextLink
                    text={appInfo.supportEmail}
                    href="mailto:{appInfo.supportEmail}"
                />
            </span>
        </section>
    {/if}
{/if}

<style>
    span {
        width: 30rem;
    }
</style>
