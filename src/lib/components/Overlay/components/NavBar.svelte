<script>
    import { _, json, locale } from 'svelte-i18n';

    import MainButton from './MainButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';
    import UserProfileIcon from '../../inline-images/UserProfileIcon.svelte';
    import DropdownMenu from '../../DropdownMenu.svelte';

    import { openAnotherOverlay, setCookie, showSuccessNotification, closeOverlays } from '../../../utilities/helpers.js';
    import { saveLang, logout } from '../../../utilities/api.js';
    import { appStateStore, userStateStore } from "../../../../stores/state.js";

    let profileDropDownOpen = false;

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;

    $: dropdownData = [{
        text: $_('menuSidebar.logout'),
        action: async (e) => {
            e.preventDefault();
            profileDropDownOpen = false;
            closeOverlays();
            const { error, data } = await logout();

            if (!error) {
                userStateStore.update(state => ({
                    ...state,
                    userID: null,
                    activeRatings: 3,
                    userName: 'Аноним',
                    wantMoreRatings: false
                }));
                showSuccessNotification();
            } else {
                console.warn(error)
                // showError('unrecognizedError', error)
            }
        }
    }, {
        text: $_('menuSidebar.myRatings'),
        action: (e) => {
            e.preventDefault();
            profileDropDownOpen = false;
            openAnotherOverlay('myPlacesPopup');
        }
    }, {
        text: $_('menuSidebar.changePassword'),
        action: (e) => {
            e.preventDefault();
            profileDropDownOpen = false;
            openAnotherOverlay('forgotPasswordPopup', { isChangePass: true });
        }
    }];

    const closeStartScreen = () => {
        const { termsOfUseAgreed, startScreen } = $appStateStore;
        if (!startScreen || !termsOfUseAgreed)
            return;

        appStateStore.update(state => ({ ...state, startScreen: false }));
        setCookie('startScreen', '0', 365);
    }

    const openRegister = () => {
        if (!$appStateStore.termsOfUseAgreed)
            return;
        closeStartScreen();
        openAnotherOverlay('registerPopup');
    }

    const openLogin = () => {
        if (!$appStateStore.termsOfUseAgreed)
            return;
        closeStartScreen();
        openAnotherOverlay('loginPopup');
    }

    let isLeftHovered = false;
    const handleMouseenterLeft = () => {
        isLeftHovered = true;
    }
    const handleMouseleaveLeft = () => {
        isLeftHovered = false;
    }

    let isRightHovered = false;
    const handleMouseenterRight = () => {
        isRightHovered = true;
    }
    const handleMouseleaveRight = () => {
        isRightHovered = false;
    }

    let isCenterHovered = false;
    const handleMouseenterCenter = () => {
        isCenterHovered = true;
    }
    const handleMouseleaveCenter = () => {
        isCenterHovered = false;
    }

    const changeLanguage = async () => {
        const nextLang = $locale === 'ru' ? 'en' : 'ru';
        locale.set(nextLang);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.pathname = `/${nextLang}`;
            window.history.replaceState(null, null, url);

            if (isUserLoggedIn)
                await saveLang(nextLang);

            showSuccessNotification();
        };
    }
</script>

<nav class="transition-all fixed flex z-1 justify-center inset-x-0 top-0 h-14 -md:hidden">
    <ul class="m-0 px-4 w-full flex justify-between">
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <a
                href="/"
                class="flex flex-wrap justify-center items-center decoration-none font-bold text-lg"
                on:mouseenter={handleMouseenterLeft}
                on:mouseleave={handleMouseleaveLeft}
            >
                <img src="../images/favicon.svg" alt="{$_('navBar.logoAlt')}" class="transition-all" width='40'>
                <span class="ml-4">
                    {$_('navBar.logoTitle')}
                </span>
            </a>
        </li>
        <li
            class="m-0 p-0 list-none flex items-center justify-center"
            on:mouseenter={handleMouseenterCenter}
            on:mouseleave={handleMouseleaveCenter}
        >
            <ul>
                {#each $json('navBar.links') as { text, url }}
                    <li class="inline-block">
                        <a class="block mx-4 p-2 hover:underline" href={url}>{text}</a>
                    </li>
                {/each}
            </ul>
        </li>
        <li
            class="m-0 p-0 list-none flex items-center justify-center {!$appStateStore.termsOfUseAgreed && 'opacity-30'}"
            on:mouseenter={handleMouseenterRight}
            on:mouseleave={handleMouseleaveRight}
        >
            <a class="block mx-4 p-2" href={'#'} on:click|preventDefault={changeLanguage}>
                <span class="{$locale === 'ru' && 'underline'}">RU</span>
                /
                <span class="{$locale === 'en' && 'underline'}">EN</span>
            </a>
            {#if isUserLoggedIn}
                <a
                    href={"#"}
                    class="flex items-center relative"
                    on:focus={() => {profileDropDownOpen = true}}
                    on:blur={() => {setTimeout(() => {profileDropDownOpen = false}, 200)}}
                    on:click={(e) => {e.preventDefault()}}
                >
                    <UserProfileIcon />
                    <span class="ml-2">
                        {$userStateStore.userName}
                    </span>

                    {#if profileDropDownOpen}
                        <DropdownMenu
                            className='right-0 w-48 top-10 py-2 mt-2 bg-white bg-gray-100'
                            { dropdownData }
                        />
                    {/if}
                </a>
            {:else}
                <SecondaryButton
                    text={$_('navBar.secondaryBtn')}
                    className='py-2'
                    disabled={!$appStateStore.termsOfUseAgreed}
                    action={openLogin}
                />
                <MainButton
                    text={$_('navBar.primaryBtn')}
                    className='ml-4 py-2'
                    disabled={!$appStateStore.termsOfUseAgreed}
                    action={openRegister}
                />
            {/if}
        </li>
    </ul>
    <div class="absolute inset-0 -inset-x-80 nav_gradient {!isCenterHovered && 'opacity-90'} {isLeftHovered && 'left-0 opacity-100'} {isRightHovered && 'right-0 opacity-100'} {isCenterHovered && 'transform scale-x-150 opacity-100'}"></div>
</nav>

<style>
    .nav_gradient {
        background: linear-gradient(270deg, #FCEA8D 11.38%, #FBD2FF 50.48%, #D8F8FF 80.4%);
        /* background: #fde9ff; */
        z-index: -1;
        transition: all ease .5s;
        box-shadow: 0px 0px 30px #fde9ff;
    }

    a {
        color: var(--text-color);
    }
</style>
