<script>
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

<div class="notification filters_notification notification-show">
    <div class="notification__text">
        <a href="#" class="footer__link openFiltersFromNotifBtn" on:click|preventDefault={openFilters}>Filters</a>
        active.
        <a href="#" class="footer__link filters_notification__reset" on:click|preventDefault={resetFilters}>Reset</a>
    </div>
</div>

<style>
    .filters_notification {
        position: absolute;
        pointer-events: all;
    }
</style>
