<script>
    import { _, locale } from 'svelte-i18n';
    import { browser } from '$app/env';

    import SidebarBlock from './SidebarBlock.svelte';
    import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';

    import {
    	openAnotherOverlay,
    	closeOverlays,
    	showSuccessNotification,
    	showSomethingWrongNotification,
    	setCookie,
    	closeOverlay,
    	registerAction,
    	logError,
    } from '../../../../utilities/helpers.js';
    import { logout, saveLang, askMoreRatings } from '../../../../utilities/api.js';
    import { APP_VERSION } from '../../../../../configs/env.js';
    import { userStateStore, isDesktop } from "../../../../../stores/state.js";

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    $: shouldUserHaveMoreRatingsBtn = $userStateStore.activeRatings <= 5;
    $: isUserAskedForMoreRatings = $userStateStore.wantMoreRatings;

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
    		text: $_('menuSidebar.ourPartners'),
    		href: '#',
    		onClick: e => {
    			e.preventDefault();
    			if (!$isDesktop)
    				closeOverlay('sidebar');
    			openAnotherOverlay('partnersPopup');
    		},
    	}, {
    		text: $_('menuSidebar.ourGuideBook'),
    		href: 'blog/tutorial/',
    	}, {
    		text: $_('menuSidebar.aboutUs'),
    		href: 'blog/about-us/',
    	}, {
    		text: $_('menuSidebar.support'),
    		href: 'blog/support/',
    	}, {
    		text: $_('menuSidebar.blog'),
    		href: 'blog/',
    	}],
    };

    $: if ($locale === 'ru') {
    	dataBottomBlock = {
    		...dataBottomBlock,
    		list: [
    			{
    				text: $_('menuSidebar.newsTelegram'),
    				href: 'https://t.me/measureland_ru',
    			}, {
    				text: $_('menuSidebar.checkList'),
    				href: 'blog/universal-guide/',
    			},
    			...dataBottomBlock.list,
    		],
    	};
    }

    const toggleSendingEvents = () => {
    	if (!browser)
    		return;
    	const shouldSendEvent = !$userStateStore.shouldSendEvent;
    	setCookie('shouldSendEvent', shouldSendEvent ? '1' : '0', 365);
    	userStateStore.update(state => ({ ...state, shouldSendEvent }));
    };

    const askForMoreRatings = async() => {
    	if (!$isDesktop)
    		closeOverlay('sidebar');
    	openAnotherOverlay('askForMoreRatingsPopup');
    	userStateStore.update(state => ({ ...state, wantMoreRatings: true }));
    	const { error } = await askMoreRatings();
    	closeOverlay('sidebar');
    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    	} else
    		showSuccessNotification();
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
</script>

<div class="min-h-full px-0 pt-8 pb-20 -lg:pb-4 relative">
    <SidebarBlock { ...dataTopBlock } className="lg:hidden"/>

    <div class="mb-8">
        <h2 class="font-bold px-8 text-xl">{$_('menuSidebar.titleMid')}</h2>
        <ul class="mt-2">
            <li>
                <a
                    href={"#"}
                    class="block px-8 link text-lg leading-9"
                    on:click|preventDefault={toggleSendingEvents}
                >
                    {$_('menuSidebar.sendCrashReports')}:
                    {#if $userStateStore.shouldSendEvent}
                        {$_('menuSidebar.toggleOn')}
                    {:else}
                        {$_('menuSidebar.toggleOff')}
                    {/if}
                </a>
            </li>
            <li>
                <a
                    href={"#"}
                    class="block px-8 link text-lg leading-9"
                    on:click|preventDefault={() => openAnotherOverlay('filtersSidebar')}
                >
                    {$_('menuSidebar.filters')}
                </a>
            </li>
            <li>
                <a
                    href={"#"}
                    class="block px-8 link text-lg leading-9"
                    on:click|preventDefault={openHowToRatePopup}
                >
                    {$_('menuSidebar.ratePlace')}
                    {#if isUserLoggedIn}
                        <div class="inline-block text-sm settings__available">
                          ({$_('menuSidebar.ratePlaceAvailable')}:
                          <span class="settings__highlight settings__highlight-small">{$userStateStore.activeRatings}</span>)
                        </div>
                    {/if}
                </a>
            </li>
            <li>
                <a
                    href={"#"}
                    class="block px-8 link text-lg leading-9"
                    on:click|preventDefault={openFeedbackPopup}
                >
                    {$_('menuSidebar.feedbackPopup')}
                </a>
            </li>
        </ul>

        {#if isUserLoggedIn && shouldUserHaveMoreRatingsBtn && isUserAskedForMoreRatings}
            <PrimaryButton
                className="mx-8 mt-2 block text-center px-5"
                disabled={true}
                text={$_('menuSidebar.requestProcessing')}
            />
        {:else if isUserLoggedIn && shouldUserHaveMoreRatingsBtn && !isUserAskedForMoreRatings}
            <PrimaryButton
                action={askForMoreRatings}
                text={$_('menuSidebar.needMoreRatings')}
                className='mx-8 mt-2 block text-center'
            />
        {/if}
    </div>

    <SidebarBlock { ...dataBottomBlock }/>

    <footer class="absolute bottom-0 inset-x-0 text-center text-sm py-5 pb-5 -lg:static">
        <div>
            <span>{$_('footer.version')}: {APP_VERSION}</span>.
            <a class="link underline" target="_blank" href="blog/terms-of-use/">{$_('footer.termsOfUse')}</a>
        </div>
        <div>
            {$_('footer.credits')} (<a class="link underline" target="_blank" rel="noopener" href="https://romanisthere.github.io/">{$_('footer.creditsLink')}</a>).
            <br/>
            <a class="link underline" target="_blank" rel="noopener" href="https://www.copyrighted.com/work/VbLLkh65Chs4gO0p">{$_('footer.allRightsReserved')}</a>. {$_('footer.rightsYear')}.
        </div>
    </footer>
</div>

<style>
    .link {
        transition: background-color .2s, color .2s;
    }

    @media (hover: hover) and (pointer: fine) {
        .link:hover {
            background-color: var(--active-color);
            color: var(--side-bg-color);
        }
    }
</style>
