<script>
    import SuccessNotification from './SuccessNotification.svelte';
    import SomethingWrongNotification from './SomethingWrongNotification.svelte';

    import { notificationsStore } from '../../../../../stores/state.js';
    import { hideSomethingWrongNotification, registerAction } from '../../../../utilities/helpers.js';

    let shouldShowSuccessNotification = false;
    let successNotificationTimeout = null;
    let shouldShowSomethingWrongNotification = false;
    let somethingWrongNotificationExpanded = false;
    let somethingWrongNotificationTimeout = null;

    const stopSomethingWrongTimeout = () => {
    	clearTimeout(somethingWrongNotificationTimeout);
    	somethingWrongNotificationTimeout = null;
    };

    const startSomethingWrongTimeout = () => {
    	somethingWrongNotificationTimeout = setTimeout(() => {
    		notificationsStore.update(state => ({ ...state, somethingWrongNotification: false }));
    		stopSomethingWrongTimeout();
    	}, 2000);
    };

    const somethingWrongOnMouseenter = () => {
    	stopSomethingWrongTimeout();
    	somethingWrongNotificationExpanded = true;
    	registerAction('hoverNotification');
    };

    const somethingWrongOnMouseleave = () => {
    	startSomethingWrongTimeout();
    	somethingWrongNotificationExpanded = false;
    };

    const somethignWrongOnClick = () => {
    	hideSomethingWrongNotification();
    	registerAction('clickNotification');
    };

    const showAndHideNotifications = ({ successNotification, somethingWrongNotification }) => {
    	if (somethingWrongNotification && !somethingWrongNotificationTimeout) {
    		shouldShowSomethingWrongNotification = true;
    		startSomethingWrongTimeout();
    		registerAction('showNotification');
    	}

    	if (successNotification && !successNotificationTimeout) {
    		shouldShowSuccessNotification = true;
    		successNotificationTimeout = setTimeout(() => {
    			notificationsStore.update(state => ({ ...state, successNotification: false }));
    			clearTimeout(successNotificationTimeout);
    			successNotificationTimeout = null;
    		}, 1000);
    	}

    	if (!successNotification)
    		shouldShowSuccessNotification = false;

    	if (!somethingWrongNotification)
    		shouldShowSomethingWrongNotification = false;
    };

    $: showAndHideNotifications($notificationsStore);
</script>

<div class="right-4 fixed w-16 flex flex-col z-4">
    {#if shouldShowSuccessNotification}
        <SuccessNotification />
    {/if}

    {#if shouldShowSomethingWrongNotification}
        <SomethingWrongNotification
            on:mouseenter={somethingWrongOnMouseenter}
            on:mouseleave={somethingWrongOnMouseleave}
            on:click={somethignWrongOnClick}
            expanded={somethingWrongNotificationExpanded}
        />
    {/if}
</div>

<style>
    div {
        top: calc(1rem + 64px + var(--distance-top));
    }
</style>
