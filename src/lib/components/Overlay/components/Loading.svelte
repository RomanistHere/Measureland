<script>
	import { browser } from "$app/env";
	import { _ } from "svelte-i18n";

	import Spinner from "../../ui-elements/Spinner.svelte";
	import TextLink from "../../ui-elements/TextLink.svelte";

	import { checkUser } from "../../../utilities/api.js";
	import { getCookie, logError, registerAction, showSomethingWrongNotification } from "../../../utilities/helpers.js";
	import { appStateStore, userStateStore } from "../../../../stores/state.js";
	import { appInfo } from "../../../../configs/index.js";

	export let hiddenLoading = false;

	let isError = false;
	let isLoaded = false;

	const userInit = async () => {
		const { error, data } = await checkUser();

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			isError = true;
			if (error === "Too many requests, please try again later")
				appStateStore.update(state => ({ ...state, shouldWork: false }));

			return;
		}
		const { userID, userName, activeRatings, wantMoreRatings, numberOfRatings, numberOfPois } = data;
		const shouldSendEvent = browser ? getCookie("shouldSendEvent") !== "0" : false;
		const shouldShowStartScreen = browser ? getCookie("startScreen") !== "0" : false;

		isLoaded = true;
		if (userID) {
			userStateStore.update(state => ({
				...state,
				userID,
				activeRatings,
				userName,
				wantMoreRatings,
				shouldSendEvent,
				numberOfRatings,
				numberOfPois,
			}));
			registerAction("user");
		}

		if (shouldShowStartScreen) {
			appStateStore.update(state => ({ ...state, startScreen: true }));
			registerAction("startScreen");
		}

		if (shouldSendEvent) {
			userStateStore.update(state => ({ ...state, shouldSendEvent: true }));
		}
	};

	// eslint-disable-next-line no-unused-vars
	const promise = userInit();
</script>

{#if !isLoaded && !hiddenLoading}
	<Spinner
		className="fixed z-3 inset-0"
		isWithText={!isError}
		isWithBg={true}
	/>

	{#if isError}
		<section class="fixed z-4 flex justify-center items-center inset-0 -md:px-8">
            <span class="text-xl pt-64">
                {$_("errors.noResponseFromServer")}
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
