<script>
    import { _, locale } from 'svelte-i18n';

    import SidebarWrap from './SidebarWrap.svelte';
    import SidebarBlock from './SidebarBlock.svelte';

    import { openAnotherOverlay } from '../../../../utilities/helpers.js';
    import { userStateStore } from "../../../../../stores/state.js";

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;
    const currentVersion = '1.2.1';

    // TODO: get for user
    let numberOfAvailableRatings = 3;

    $: dataTopBlock = {
        title: $_('menuSidebar.titleTop'),
        list: [{
            text: $_('menuSidebar.loginOrRegister'),
            shouldShow: true,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('loginPopup');
            }
        }, {
            text: $_('menuSidebar.logout'),
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: $_('menuSidebar.myRatings'),
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: $_('menuSidebar.changePassword'),
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: $_('menuSidebar.changeLanguage'),
            shouldShow: true,
            href: `#`,
            onClick: (e) => {
                e.preventDefault();
                const nextLang = $locale === 'ru' ? 'en' : 'ru';
                locale.set(nextLang);
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.pathname = `/${nextLang}`;
                    window.history.replaceState(null, null, url);
                };
            }
        },]
    };

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
            text: $_('menuSidebar.paidOptions'),
            href: 'blog/paid-options/',
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
</script>

<SidebarWrap>
    <SidebarBlock { ...dataTopBlock }/>

    <div class="settings__block">
        <h2 class="rating__title title rating__item_text settings__title sidebar__title">{$_('menuSidebar.titleMid')}</h2>
        <hr>
        <ul class="settings__list">
            <li class="setting__item">
                <a href={"#"} class="settings__link settings__link-on rating__title crashReportsBtn">
                    {$_('menuSidebar.sendCrashReports')}:
                    <span class="settings__off">{$_('menuSidebar.toggleOff')}</span>
                    <span class="settings__on">{$_('menuSidebar.toggleOn')}</span>
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
                          <span class="settings__highlight settings__highlight-small">{numberOfAvailableRatings}</span>)
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
