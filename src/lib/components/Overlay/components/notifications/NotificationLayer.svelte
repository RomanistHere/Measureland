<script>
    import SuccessNotification from './SuccessNotification.svelte'
    import FiltersNotification from './FiltersNotification.svelte'
    import { notificationsStore, shouldShowFiltersNotification } from '../../../../../stores/state.js';

    let shouldShowSuccessNotification = false;
    let successNotificationTimeout = null;

    const showAndHideNotifications = ({ successNotification }) => {
        if (successNotificationTimeout)
            return;

        if (successNotification) {
            shouldShowSuccessNotification = true;
            setTimeout(() => {
                shouldShowSuccessNotification = false;
                notificationsStore.update(state => ({ ...state, successNotification: false }));
                clearTimeout(successNotificationTimeout);
                successNotificationTimeout = null;
            }, 1000);
        }
    }

    $: showAndHideNotifications($notificationsStore);
</script>

<div>
    <!-- TODO: animations -->
    {#if shouldShowSuccessNotification}
        <SuccessNotification />
    {/if}

    {#if $shouldShowFiltersNotification}
        <FiltersNotification />
    {/if}
</div>

<style>
    div {
        position: fixed;
        z-index: 4;

        top: 0;
        left: 0;
        width: calc(100% - var(--sidebar-width));
        bottom: 0;

        pointer-events: none;
    }
</style>
