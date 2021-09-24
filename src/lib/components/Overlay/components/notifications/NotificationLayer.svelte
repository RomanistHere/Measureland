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

<div class="inset-0 fixed z-4 pointer-events-none">
    <!-- TODO: animations -->
    {#if shouldShowSuccessNotification}
        <SuccessNotification />
    {/if}

    {#if $shouldShowFiltersNotification}
        <FiltersNotification />
    {/if}
</div>
