<script>
    import { browser } from '$app/env';

    import { overlayStateStore } from '../../../stores/state.js';
    import { closeOverlays, openAnotherOverlay } from '../../utilities/helpers.js';

    import PopupLayer from './components/PopupLayer.svelte';
    import SidebarLayer from './components/SidebarLayer.svelte';

    let overlayActive = false;
    let overlayName;
    let overlayData;

    const handleKeydown = event => {
        const key = event.key;
        console.log(key);
        if (overlayActive && key === 'Escape') {
            overlayActive = false;
            closeOverlays();
        }
    }

    const checkIsOpen = state => {
        for (let [key, value] of Object.entries(state)) {
            const { isOpen, data, type } = value;
            if (isOpen)
                return { isOpen: true, key, data, type };
        }
        return { isOpen: false };
    }

    const manageOverlays = ({ isOpen, key, data, type }) => {
        // TODO: change document.body.classList when resolved:
        // https://github.com/sveltejs/svelte/issues/3105#issuecomment-622437031
        overlayActive = isOpen && type;
        if (browser)
            document.body.classList.remove('sidebar-open');

        if (!isOpen)
            return;

        overlayName = key;
        overlayData = data;

        if (type === 'sidebar' && browser)
            document.body.classList.add('sidebar-open');
    }

    const openSideBar = () => openAnotherOverlay('menuSidebar');

    $: dataOpen = checkIsOpen($overlayStateStore);
    $: manageOverlays(dataOpen);
</script>

{#if overlayActive === 'popup'}
    <PopupLayer { overlayName } { overlayData } />
{:else if overlayActive === 'sidebar'}
    <SidebarLayer { overlayName } { overlayData } />
{/if}

<a href={"#"} class="overlay__btn open_settings" on:click|preventDefault={openSideBar}>
    <span class="menu_btn"></span>
</a>

<svelte:window on:keydown={handleKeydown}/>
