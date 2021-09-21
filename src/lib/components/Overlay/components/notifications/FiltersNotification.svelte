<script>
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';

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

<div class="notification filters_notification notification-show" transition:fade>
    <div class="notification__text">
        <a href="#" class="footer__link openFiltersFromNotifBtn" on:click|preventDefault={openFilters}>{$_('filterNotification.filters')}</a>
        {$_('filterNotification.active')}.
        <a href="#" class="footer__link filters_notification__reset" on:click|preventDefault={resetFilters}>{$_('filterNotification.reset')}</a>
    </div>
</div>

<style>
    .filters_notification {
        position: absolute;
        pointer-events: all;
    }
</style>
