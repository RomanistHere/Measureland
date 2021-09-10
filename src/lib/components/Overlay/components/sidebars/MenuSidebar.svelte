<script>
    import { _, locale } from 'svelte-i18n';

    import SidebarWrap from './SidebarWrap.svelte';
    import SidebarBlock from './SidebarBlock.svelte';

    import { openAnotherOverlay, closeOverlays } from '../../../../utilities/helpers.js';
    import { logout, saveLang } from '../../../../utilities/api.js';
    import { userStateStore } from "../../../../../stores/state.js";

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    // TODO: get real version
    const currentVersion = '2.0.0';

    const toggleSendingEvents = () => {
        const shouldSendEvent = !$userStateStore.shouldSendEvent;
        setCookie('shouldSendEvent', shouldSendEvent ? '1' : '0', 365);
        userStateStore.update(state => ({
            ...state,
            shouldSendEvent
        }));
    }

    $: dataTopBlock = {
        title: $_('menuSidebar.titleTop'),
        list: [{
            text: $_('menuSidebar.loginOrRegister'),
            shouldShow: !isUserLoggedIn,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('loginPopup');
            }
        }, {
            text: $_('menuSidebar.logout'),
            shouldShow: isUserLoggedIn,
            href: '#',
            onClick: async (e) => {
                e.preventDefault();
                closeOverlays();
                const { error, data } = await logout();

                if (!error) {
                    // showSuccessNotification()
                    userStateStore.update(state => ({
                        ...state,
                        userID: null,
                        activeRatings: 3,
                        userName: 'Аноним',
                        wantMoreRatings: false
                    }));
                } else {
                    console.warn(error)
                    // showError('unrecognizedError', error)
                }
            }
        }, {
            text: $_('menuSidebar.myRatings'),
            shouldShow: isUserLoggedIn,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('myPlacesPopup');
            }
        }, {
            text: $_('menuSidebar.changePassword'),
            shouldShow: isUserLoggedIn,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: $_('menuSidebar.changeLanguage'),
            shouldShow: true,
            href: `#`,
            onClick: async (e) => {
                e.preventDefault();
                const nextLang = $locale === 'ru' ? 'en' : 'ru';
                locale.set(nextLang);
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.pathname = `/${nextLang}`;
                    window.history.replaceState(null, null, url);

                    if (isUserLoggedIn)
                        await saveLang(nextLang);

                    // showSuccessNotification
                };
            }
        },]
    };

    // $: dataMiddleBlock = {
    //     title: $_('menuSidebar.titleMid'),
    //     list: [{
    //         text: $_('menuSidebar.sendCrashReports') + $userStateStore.shouldSendEvent ? $_('menuSidebar.toggleOn') : $_('menuSidebar.toggleOff'),
    //         shouldShow: !isUserLoggedIn,
    //         href: '#',
    //         onClick: (e) => {
    //             e.preventDefault();
    //             toggleSendingEvents();
    //         }
    //     }, {
    //         text: isUserLoggedIn ? : $_('menuSidebar.ratePlace'),
    //         shouldShow: isUserLoggedIn,
    //         href: '#',
    //         onClick: (e) => {
    //             e.preventDefault();
    //         }
    //     }, {
    //         text: $_('menuSidebar.changePassword'),
    //         shouldShow: isUserLoggedIn,
    //         href: '#',
    //         onClick: (e) => {
    //             e.preventDefault();
    //             openAnotherOverlay('howToRatePopup');
    //         }
    //     }]
    // };

    $: dataBottomBlock = {
        title: $_('menuSidebar.titleBot'),
        list: [{
            text: $_('menuSidebar.ourPartners'),
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('partnersPopup');
            }
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
        }]
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
            ]
        }
    }
</script>

<SidebarWrap>
    <SidebarBlock { ...dataTopBlock }/>

    <div class="settings__block">
        <h2 class="rating__title title rating__item_text settings__title sidebar__title">{$_('menuSidebar.titleMid')}</h2>
        <hr>
        <ul class="settings__list">
            <li class="setting__item">
                <a href={"#"} class="settings__link rating__title" on:click|preventDefault={toggleSendingEvents}>
                    {$_('menuSidebar.sendCrashReports')}:
                    {#if $userStateStore.shouldSendEvent}
                        {$_('menuSidebar.toggleOn')}
                    {:else}
                        {$_('menuSidebar.toggleOff')}
                    {/if}
                </a>
            </li>
            <li class="setting__item">
                <a href={"#"} class="settings__link rating__title openFiltersBtn">{$_('menuSidebar.filters')}</a>
            </li>
            <!-- <li class="setting__item">
                <a href={"#"} class="settings__link rating__title vizualizeLoadingBtn">
                    Vizualize loading:
                    <span class="settings__off">OFF</span>
                    <span class="settings__on">ON</span>
                </a>
            </li> -->
            <li class="setting__item">
                <a href={"#"} class="settings__link rating__title" on:click|preventDefault={() => openAnotherOverlay('howToRatePopup')}>
                    {$_('menuSidebar.ratePlace')}
                    {#if isUserLoggedIn}
                        <div class="settings__title-small settings__available">
                          ({$_('menuSidebar.ratePlaceAvailable')}:
                          <span class="settings__highlight settings__highlight-small">{$userStateStore.activeRatings}</span>)
                        </div>
                    {/if}
                </a>
            </li>
        </ul>
        <a href={"#"} class="btn moreRatingsBtn loggedInShow settings__btn">
            <span class="settings__showed_rating_text">{$_('menuSidebar.needMoreRatings')}</span>
            <span class="settings__hidden_ratings_text">{$_('menuSidebar.requestProcessing')}</span>
        </a>
    </div>

    <SidebarBlock { ...dataBottomBlock }/>

    <footer class="footer">
        <div>
            <span class="footer__version">{$_('footer.version')}: {currentVersion}</span>.
            <a class="footer__link" target="_blank" href="blog/terms-of-use/">{$_('footer.termsOfUse')}</a>
        </div>
        <div>
            {$_('footer.credits')} (<a class="footer__link" target="_blank" rel="noopener" href="https://romanisthere.github.io/">{$_('footer.creditsLink')}</a>).
            <br/>
            <a class="footer__link" target="_blank" rel="noopener" href="https://www.copyrighted.com/work/VbLLkh65Chs4gO0p">{$_('footer.allRightsReserved')}</a>. {$_('footer.rightsYear')}.
        </div>
    </footer>
</SidebarWrap>
