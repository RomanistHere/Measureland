<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    import { overlayStateStore } from '../../../stores/state.js';
    import { closeOverlays, openAnotherOverlay } from '../../utilities/helpers.js';

    import PopupLayer from './components/popups/PopupLayer.svelte';
    import SidebarLayer from './components/sidebars/SidebarLayer.svelte';
	import NotificationLayer from './components/notifications/NotificationLayer.svelte';
    import Loading from './components/Loading.svelte';
    import NavBar from './components/NavBar.svelte';

    let popupActive = false;
    let popupName;
    let popupData;
    let sidebarActive = false;
    let sidebarName;
    let sidebarData;
    let shouldShowStartScreen = true;
    let StartScreen;

    const handleKeydown = event => {
        const key = event.key;
        // console.log(key);
        if ((popupActive || sidebarActive) && key === 'Escape')
            closeOverlays();
    }

    const checkIsOpen = state => {
        let openOverlays = [];
        for (let [key, value] of Object.entries(state)) {
            const { isOpen, data, type } = value;
            if (isOpen)
                openOverlays.push({ key, data, type });
        }

        if (openOverlays.length >= 2 && openOverlays[0].type === openOverlays[1].type) {
            throw new Error(`Can't open two or more modals at once`);
        }

        if (openOverlays.length === 1 && openOverlays[0].key === 'commentsSidebar') {
            // close sidebar if only comments is opened (expected behaviour: user closes rating)
            openOverlays = [];
            closeOverlays();
        }

        return openOverlays;
    }

    const manageOverlay = ({ key, data, type }) => {
        if (type === 'sidebar') {
            sidebarName = key;
            sidebarData = data;
            sidebarActive = true;
            if (browser)
                document.body.classList.add('sidebar-open');
        } else if (type === 'popup') {
            popupName = key;
            popupData = data;
            popupActive = true;
        }
    }

    const manageOverlays = openOverlays => {
        // TODO: change document.body.classList when resolved:
        // https://github.com/sveltejs/svelte/issues/3105#issuecomment-622437031
        if (browser)
            document.body.classList.remove('sidebar-open');

        sidebarActive = false;
        popupActive = false;

        if (openOverlays.length === 0)
            return;

        for (let i = 0; i < openOverlays.length; i++)
            manageOverlay(openOverlays[i]);
    }

    const openSideBar = () => openAnotherOverlay('menuSidebar');

    $: dataOpen = checkIsOpen($overlayStateStore);
    $: manageOverlays(dataOpen);

    onMount(async () => {
		const module = await import('./components/StartScreen/StartScreen.svelte');
		StartScreen = module.default;
	});
</script>

<!-- // show loader while user data is loading -->
<Loading />

<!-- {#if shouldShowStartScreen}
    <svelte:component this={StartScreen}/>
{/if}

<NavBar /> -->

{#if popupActive}
    <PopupLayer { popupName } { popupData } />
{/if}

{#if sidebarActive}
    <SidebarLayer { sidebarName } { sidebarData } />
{/if}

<a href={"#"} class="overlay__btn open_settings" on:click|preventDefault={openSideBar}>
    <span class="menu_btn"></span>
</a>

<NotificationLayer />

<svelte:window on:keydown={handleKeydown}/>
