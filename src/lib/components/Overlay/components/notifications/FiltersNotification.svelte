<script>
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';

    import TextButton from '../../../ui-elements/TextButton.svelte';

    import { filtersStore } from "../../../../../stores/state.js";
    import { openAnotherOverlay, closeOverlays } from "../../../../utilities/helpers.js";

    const openFilters = () =>
        openAnotherOverlay('filtersSidebar');

    const resetFilters = () => {
        closeOverlays();
        filtersStore.update(state => ({
            ...state,
            isFiltersOn: true,
            filters: null
        }));
    }
</script>

<div class="fixed bottom-12 left-1/2 transform -translate-x-1/2 rounded-md px-4 py-1 z-1 glassmorphism whitespace-nowrap" transition:fade>
    <TextButton
        action={openFilters}
        text={$_('filterNotification.filters')}
    />
    {$_('filterNotification.active')}.
    <TextButton
        action={resetFilters}
        text={$_('filterNotification.reset')}
    />
</div>

<style>
    div {
        /* background-color: var(--side-bg-color); */
        border: 2px solid var(--text-color);
        pointer-events: all;
    }
</style>
