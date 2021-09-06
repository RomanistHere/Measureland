<script>
    import SidebarWrap from './SidebarWrap.svelte';
    import SidebarBlock from './SidebarBlock.svelte';

    import { openAnotherOverlay } from '../../../../utilities/helpers.js';

    const dataTopBlock = {
        title: 'Account',
        list: [{
            text: 'Login/Register',
            shouldShow: true,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('loginPopup');
            }
        }, {
            text: 'Log out',
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: 'My ratings',
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: 'Change the password',
            shouldShow: false,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        }, {
            text: 'Change language (язык)',
            shouldShow: true,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            }
        },]
    };

    const dataBottomBlock = {
        title: 'Related',
        list: [{
            text: 'Our partners',
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                openAnotherOverlay('partnersPopup');
            }
        }, {
            text: 'Our guide book (Tutorial)',
            href: 'blog/tutorial/',
        }, {
            text: 'Paid options',
            href: 'blog/paid-options/',
        }, {
            text: 'About us',
            href: 'blog/about-us/',
        }, {
            text: 'Support',
            href: 'blog/support/',
        }, {
            text: 'Blog',
            href: 'blog/',
        }]
    };
</script>

<SidebarWrap>
    <SidebarBlock { ...dataTopBlock }/>

    <div class="settings__block">
        <h2 class="rating__title title rating__item_text settings__title sidebar__title">Features</h2>
        <hr>
        <ul class="settings__list">
            <li class="setting__item">
                <a href={"#"} class="settings__link settings__link-on rating__title crashReportsBtn">
                    Send crash reports:
                    <span class="settings__off">OFF</span>
                    <span class="settings__on">ON</span>
                </a>
            </li>
            <li class="setting__item">
                <a href={"#"} class="settings__link rating__title openFiltersBtn">Filters <span class="settings__highlight">(new)</span></a>
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
                    Rate a place
                    <div class="settings__title-small settings__available">
                      (available:
                      <span class="settings__highlight settings__highlight-small availRating">3</span>)
                    </div>
                </a>
            </li>
        </ul>
        <a href={"#"} class="btn moreRatingsBtn loggedInShow settings__btn">
            <span class="settings__showed_rating_text">I need more ratings!</span>
            <span class="settings__hidden_ratings_text">Request processing</span>
        </a>
    </div>

    <SidebarBlock { ...dataBottomBlock }/>

    <footer class="footer">
        <div>
            <span class="footer__version">Version: 1.2.1</span>.
            <a class="footer__link" target="_blank" href="blog/terms-of-use/">Terms of use</a>
        </div>
        <div>
            by Roman Smunyov (<a class="footer__link" target="_blank" rel="noopener" href="https://romanisthere.github.io/">RomanistHere</a>).
            <br/>
            <a class="footer__link" target="_blank" rel="noopener" href="https://www.copyrighted.com/work/VbLLkh65Chs4gO0p">All rights reserved</a>. © 2021.
        </div>
    </footer>
</SidebarWrap>
