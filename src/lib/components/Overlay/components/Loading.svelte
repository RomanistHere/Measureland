<script>
    import { browser } from '$app/env';
    import { _ } from 'svelte-i18n';

    import Spinner from '../../ui-elements/Spinner.svelte';
    import TextLink from '../../ui-elements/TextLink.svelte';

    import { checkUser } from "../../../utilities/api.js";
    import { getCookie, showSomethingWrongNotification, registerAction, logError } from "../../../utilities/helpers.js";
    import { userStateStore, appStateStore } from "../../../../stores/state.js";
    import { appInfo } from '../../../../configs/index.js';

    let isError = false;
    let isLoaded = false;

    const userInit = async() => {
    	const { error, data } = await checkUser();

    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
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
    		registerAction('user');
    		// for test purposes
    		// fillDB(20000)
    	}

    	if (shouldShowStartScreen) {
    		appStateStore.update(state => ({ ...state, startScreen: true }));
    		registerAction('startScreen');
    	}
    };

    // eslint-disable-next-line no-unused-vars
    const promise = userInit();
</script>

{#if !isLoaded}
    <Spinner
        className="fixed z-3 inset-0"
        isWithText={!isError}
        isWithBg={true}
    />

    {#if isError}
        <section class="absolute z-4 flex justify-center items-center inset-0">
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
        width: 32rem;
    }
</style>
