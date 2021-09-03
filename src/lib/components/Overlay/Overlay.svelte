<script>
    import { overlayStateStore } from '../../../stores/state.js';
    import { closeOverlays } from '../../utilities/helpers.js';

    import PopupLayer from './components/PopupLayer.svelte';
    // import SidebarLayer from './components/SidebarLayer.svelte';
    let overlayActive = false;
    let overlayName;
    let overlayData;

    const checkIsOpen = state => {
        for (let [key, value] of Object.entries(state)) {
            const { isOpen, data, type } = value;
            if (isOpen)
                return { isOpen: true, key, data, type };
        }
        return { isOpen: false };
    }

    const manageOverlays = ({ isOpen, key, data, type }) => {
        overlayActive = isOpen && type;

        if (!isOpen)
            return;

        overlayName = key;
        overlayData = data;
    }

    $: dataOpen = checkIsOpen($overlayStateStore);
    $: manageOverlays(dataOpen);

    const handleKeydown = event => {
        const key = event.key;
        console.log(key);
        if (overlayActive && key === 'Escape') {
            overlayActive = false;
            closeOverlays();
        }
    }
</script>

{#if overlayActive === 'popup'}
    <PopupLayer { overlayName } { overlayData } />
{:else if overlayActive === 'sidebar'}
    <SidebarLayer { overlayName } { overlayData } />
{/if}

<svelte:window on:keydown={handleKeydown}/>
