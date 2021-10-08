<script>
    import { _, json, locale } from 'svelte-i18n';

    import PrimaryButton from '../../ui-elements/PrimaryButton.svelte';
    import SecondaryButton from '../../ui-elements/SecondaryButton.svelte';
    import UserProfileIcon from '../../inline-images/UserProfileIcon.svelte';
    import DropdownMenu from '../../ui-elements/DropdownMenu.svelte';

    import { openAnotherOverlay, setCookie, showSuccessNotification, showSomethingWrongNotification, closeOverlays, registerAction } from '../../../utilities/helpers.js';
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
                registerAction('navbarLogout');
            } else {
                console.warn(error)
                showSomethingWrongNotification();
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
        registerAction('navbarButtons');
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
            url.pathname = `/${nextLang}/`;
            window.history.replaceState(null, null, url);

            if (isUserLoggedIn)
                await saveLang(nextLang);

            showSuccessNotification();
            registerAction('navbarLanguage');
        };
    }
</script>

<nav class="transition-all fixed flex z-5 justify-center inset-x-4 top-4 h-14 -lg:hidden">
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
                        <a class="block mx-4 p-2 hover:underline" target="_blank" href={url}>{text}</a>
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
                <span class:underline={$locale === 'ru'}>RU</span>
                /
                <span class:underline={$locale === 'en'}>EN</span>
            </a>
            {#if isUserLoggedIn}
                <a
                    href={"#"}
                    class="flex items-center relative"
                    on:blur={() => {setTimeout(() => {profileDropDownOpen = false}, 200)}}
                    on:click={(e) => {
                        e.preventDefault();
                        profileDropDownOpen = !profileDropDownOpen;
                    }}
                >
                    <UserProfileIcon />
                    <div class="ml-2 flex">
                        <span class="name truncate block" title='Account of {$userStateStore.userName}. Click to expand.'>
                            {$userStateStore.userName}
                        </span>
                        - {$userStateStore.activeRatings}🏡
                    </div>

                    {#if profileDropDownOpen}
                        <DropdownMenu
                            className='right-0 w-48 top-10 mt-2'
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
                <PrimaryButton
                    text={$_('navBar.primaryBtn')}
                    className='ml-4 py-2'
                    disabled={!$appStateStore.termsOfUseAgreed}
                    action={openRegister}
                />
            {/if}
        </li>
    </ul>
    <div class="absolute inset-0 overflow-hidden -z-1 glassmorphism">
        <div
            class="absolute inset-0 -inset-x-80 -z-1 nav_gradient transform"
            class:opacity-50={isCenterHovered || isLeftHovered || isRightHovered}
            class:opacity-30={!isCenterHovered}
            class:left-0={isLeftHovered}
            class:right-0={isRightHovered}
            class:scale-x-150={isCenterHovered}
        ></div>
    </div>
</nav>

<style>
    .nav_gradient {
        background: #fde9ff;
        background: linear-gradient(270deg, #FCEA8D 11.38%, #FBD2FF 50.48%, #D8F8FF 80.4%);
        transition: all ease .5s;
    }

    .name {
        max-width: 10rem;
    }
</style>
