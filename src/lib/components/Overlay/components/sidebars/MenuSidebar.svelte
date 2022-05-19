<script>
	import { _, json, locale } from 'svelte-i18n';
	import { browser } from '$app/env';

	import SidebarBlock from './SidebarBlock.svelte';
	import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';

	import {
		closeOverlay,
		closeOverlays,
		logError,
		openAnotherOverlay,
		registerAction,
		setCookie,
		showSomethingWrongNotification,
		showSuccessNotification,
		getCopyrightYears,
	} from '../../../../utilities/helpers.js';
	import { askMoreRatings, logout, saveLang } from '../../../../utilities/api.js';
	import { APP_VERSION } from '../../../../../configs/env.js';
	import { appStateStore, isDesktop, userStateStore } from "../../../../../stores/state.js";

	$: isUserLoggedIn = $userStateStore.userID === null ? false : true;
	$: shouldUserHaveMoreRatingsBtn = $userStateStore.activeRatings <= 5;
	$: isUserAskedForMoreRatings = $userStateStore.wantMoreRatings;

	$: dataNavBlock = {
		title: $_('menuSidebar.titleNav'),
		list: $json('navBar.links').map(({ text, url }) => ({ text, href: url })),
	};

	$: dataTopBlock = {
		title: $_('menuSidebar.titleTop'),
		list: [{
			text: $_('menuSidebar.loginOrRegister'),
			shouldShow: !isUserLoggedIn,
			href: '#',
			onClick: e => {
				e.preventDefault();
				closeOverlay('sidebar');
				openAnotherOverlay('loginPopup');
			},
		}, {
			text: $_('menuSidebar.logout'),
			shouldShow: isUserLoggedIn,
			href: '#',
			onClick: async e => {
				e.preventDefault();
				closeOverlays();
				const { error } = await logout();
				if (!error) {
					userStateStore.update(state => ({
						...state,
						userID: null,
						activeRatings: 3,
						userName: 'Аноним',
						wantMoreRatings: false,
					}));
					showSuccessNotification();
					registerAction('logoutMobile');
				} else {
					logError(error);
					showSomethingWrongNotification();
				}
			},
		}, {
			text: $_('menuSidebar.myRatings'),
			shouldShow: isUserLoggedIn,
			href: '#',
			onClick: e => {
				e.preventDefault();
				closeOverlay('sidebar');
				openAnotherOverlay('myPlacesPopup');
			},
		}, {
			text: $_('menuSidebar.changePassword'),
			shouldShow: isUserLoggedIn,
			href: '#',
			onClick: e => {
				e.preventDefault();
				closeOverlay('sidebar');
				openAnotherOverlay('forgotPasswordPopup', { isChangePass: true });
			},
		}, {
			text: $_('menuSidebar.changeLanguage'),
			shouldShow: true,
			href: `#`,
			onClick: async e => {
				e.preventDefault();
				const nextLang = $locale === 'ru' ? 'en' : 'ru';
				locale.set(nextLang);
				if (typeof window !== 'undefined') {
					const url = new URL(window.location.href);
					url.pathname = `/${nextLang}`;
					window.history.replaceState(null, null, url);
					if (isUserLoggedIn)
						await saveLang(nextLang);
					showSuccessNotification();
					registerAction('changeLanguageMobile');
				}
			},
		}],
	};

	$: dataBottomBlock = {
		title: $_('menuSidebar.titleBot'),
		list: [{
			text: $_('menuSidebar.ourGuideBook'),
			href: 'blog/tutorial/',
		}, {
			text: $_('menuSidebar.ourPartners'),
			href: '#',
			onClick: e => {
				e.preventDefault();
				if (!$isDesktop)
					closeOverlay('sidebar');
				openAnotherOverlay('partnersPopup');
			},
		}, {
			text: $_('menuSidebar.newsTelegram'),
			href: `https://t.me/measureland${$locale === 'ru' ? '_ru' : ''}`,
		}, {
			text: $_('menuSidebar.aboutUs'),
			href: 'blog/about-us/',
		}],
	};

	$: if ($locale === 'ru') {
		dataBottomBlock = {
			...dataBottomBlock,
			list: [
				{
					text: $_('menuSidebar.checkList'),
					href: 'blog/universal-guide/',
				},
				...dataBottomBlock.list,
			],
		};
	}

	const togglePOIs = () =>
		appStateStore.update(state => ({ ...state, shouldShowPOIs: !state.shouldShowPOIs }));

	const toggleSendingEvents = () => {
		if (!browser)
			return;
		const shouldSendEvent = !$userStateStore.shouldSendEvent;
		setCookie('shouldSendEvent', shouldSendEvent ? '1' : '0', 365);
		userStateStore.update(state => ({ ...state, shouldSendEvent }));
	};

	const askForMoreRatings = async () => {
		if (!$isDesktop)
			closeOverlay('sidebar');
		openAnotherOverlay('askForMoreRatingsPopup');
		userStateStore.update(state => ({ ...state, wantMoreRatings: true }));
		const { error } = await askMoreRatings();

		if (error) {
			logError(error);
			showSomethingWrongNotification();
		} else {
			showSuccessNotification();
		}
	};

	const openHowToRatePopup = () => {
		if (!$isDesktop)
			closeOverlay('sidebar');
		openAnotherOverlay('howToRatePopup');
	};

	const openFeedbackPopup = () => {
		if (!$isDesktop)
			closeOverlay('sidebar');
		openAnotherOverlay('feedbackPopup');
	};

	const yearsCopyright = getCopyrightYears();
</script>

<div class="min-h-full px-0 pt-1 -lg:pb-4 relative">
	<SidebarBlock { ...dataNavBlock } className="lg:hidden" />
	<SidebarBlock { ...dataTopBlock } className="lg:hidden" />

	<div class="my-2">
		<ul class="mt-1">
			<li>
				<a
					href={"#"}
					class="block px-6 hoverable-link py-2 leading-5"
					on:click|preventDefault={openHowToRatePopup}
				>
					{$_('menuSidebar.ratePlace')}
					{#if isUserLoggedIn}
						<div class="inline-block text-sm settings__available">
							({$_('menuSidebar.ratePlaceAvailable')}:
							<span
								class="settings__highlight settings__highlight-small"
							>{$userStateStore.activeRatings}</span>)
						</div>
					{/if}
				</a>
			</li>
			<li>
				<a
					href={"#"}
					class="block px-6 hoverable-link py-2 leading-5"
					on:click|preventDefault={() => openAnotherOverlay('filtersSidebar')}
				>
					{$_('menuSidebar.filters')}
				</a>
			</li>
			<li>
				<a
					href={"#"}
					class="block px-6 hoverable-link py-2 leading-5"
					on:click|preventDefault={openFeedbackPopup}
				>
					{$_('menuSidebar.feedbackPopup')}
				</a>
			</li>
		</ul>

		<div class="px-6 my-2">
			<hr>
		</div>

		<ul>
			<li>
				<a
					href={"#"}
					class="block px-6 hoverable-link py-2 leading-5"
					on:click|preventDefault={togglePOIs}
				>
					{$_('menuSidebar.POIs')}
					<p
						class:text-danger-red={!$appStateStore.shouldShowPOIs}
						class:text-on-green={$appStateStore.shouldShowPOIs}
					>
						{#if $appStateStore.shouldShowPOIs}
							{$_('menuSidebar.toggleOn')}
						{:else}
							{$_('menuSidebar.toggleOff')}
						{/if}
					</p>
				</a>
			</li>
			<li>
				<a
					href={"#"}
					class="block px-6 hoverable-link py-2 leading-5"
					on:click|preventDefault={toggleSendingEvents}
				>
					{$_('menuSidebar.sendCrashReports')}
					<p
						class:text-danger-red={!$userStateStore.shouldSendEvent}
						class:text-on-green={$userStateStore.shouldSendEvent}
					>
						{#if $userStateStore.shouldSendEvent}
							{$_('menuSidebar.toggleOn')}
						{:else}
							{$_('menuSidebar.toggleOff')}
						{/if}
					</p>
				</a>
			</li>
		</ul>
	</div>

	<SidebarBlock { ...dataBottomBlock } />

	<div class="my-2 px-6">
		{#if isUserLoggedIn && shouldUserHaveMoreRatingsBtn && isUserAskedForMoreRatings}
			<div class="block text-center border-txt-tertiary border rounded-md w-full text-txt-tertiary px-6 py-4 leading-5">
				{$_('menuSidebar.requestProcessing')}
			</div>
		{:else if isUserLoggedIn && shouldUserHaveMoreRatingsBtn && !isUserAskedForMoreRatings}
			<button
				on:click={askForMoreRatings}
				class="block text-center border-main border rounded-md w-full text-main px-6 py-4 leading-5 hoverable-prim"
			>
				{$_('menuSidebar.needMoreRatings')}
			</button>
		{/if}
	</div>

	<footer class="text-sm px-6 pb-4 text-txt-secondary">
		<p>{$_('footer.version')}: {APP_VERSION}.</p>
		<div>
			<a class="hoverable-link underline" target="_blank" href="blog/terms-of-use/">{$_('footer.termsOfUse')}</a>
		</div>
		<div>
			{$_('footer.credits')} (<a
			class="hoverable-link underline" target="_blank" rel="noopener" href="https://romanisthere.github.io/"
		>{$_('footer.creditsLink')}</a>).
			<br />
			<a
				class="hoverable-link underline" target="_blank" rel="noopener"
				href="https://www.copyrighted.com/work/VbLLkh65Chs4gO0p"
			>{$_('footer.allRightsReserved')}</a>
			<p>
				{yearsCopyright}.
			</p>
		</div>
	</footer>
</div>
