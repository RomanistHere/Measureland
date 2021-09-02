<script>
    import { overlayStateStore } from '../../../stores/state.js';
    import { overlayStateDefault } from '../../constants/overlayStateDefault.js';

    import PopupLayer from './components/PopupLayer.svelte';
    // import SidebarLayer from './components/SidebarLayer.svelte';
    let popupActive = false;
    let popupName;
    let popupData;

    const checkIsOpen = state => {
        for (let [key, value] of Object.entries(state)) {
            const { isOpen, data } = value;
            if (isOpen)
                return { isOpen: true, key, data };
        }
        return { isOpen: false };
    }

    const manageOverlays = ({ isOpen, key, data }) => {
        popupActive = isOpen;

        if (!isOpen)
            return;

        popupName = key;
        popupData = data;
    }

    $: dataOpen = checkIsOpen($overlayStateStore);
    $: manageOverlays(dataOpen);

    const handleKeydown = event => {
        const key = event.key;
        console.log(key);
        if (popupActive && key === 'Escape') {
            popupActive = false;
            overlayStateStore.update(state => overlayStateDefault);
        }
    }
</script>

{#if popupActive}
    <PopupLayer { popupName } { popupData } />
{/if}
<!-- <SidebarLayer /> -->

<svelte:window on:keydown={handleKeydown}/>
