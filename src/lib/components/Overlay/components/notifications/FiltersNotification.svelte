<script>
	import { fade } from 'svelte/transition';
	import { _ } from 'svelte-i18n';

	import TextButton from '../../../ui-elements/TextButton.svelte';

	import {
		appStateStore,
		filtersStore,
		overlayStateStore,
		shouldShowFiltersNotification,
	} from "../../../../../stores/state.js";
	import { closeOverlays, openAnotherOverlay, registerAction } from "../../../../utilities/helpers.js";

	$: openedOverlayTypes = Object.values($overlayStateStore).filter(({ isOpen }) => isOpen === true).map(({ type }) => type);
	$: isPopupOpened = openedOverlayTypes.includes('popup');
	$: isSidebarOpened = openedOverlayTypes.includes('sidebar');
	$: isLeftCentered = $appStateStore.startScreen || isPopupOpened;

	const openFilters = () => {
		registerAction('filtersNotifcationClick');
		openAnotherOverlay('filtersSidebar');
	};

	const resetFilters = () => {
		registerAction('filtersNotifcationClick');
		closeOverlays();
		filtersStore.update(state => ({
			...state,
			isFiltersOn: true,
			filters: null,
		}));
	};

	const getLeftClass = (isPopup, isSidebar) => {
		if (isPopup && isSidebar)
			return 'custom_left';
		else if (isPopup)
			return 'left-1/4';
		else
			return 'left-1/2';
	};
</script>

{#if $shouldShowFiltersNotification}
	<div
		class={`fixed bottom-12
		    ${getLeftClass(isLeftCentered, isSidebarOpened)}
		    transform -translate-x-1/2 rounded-md px-4 py-1 z-1 glassmorphism whitespace-nowrap`}
		transition:fade
	>
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
{/if}

<style>
	div {
		border: 2px solid var(--text-color);
		pointer-events: all;
	}

    .custom_left {
        left: calc((50vw + 20rem) / 2);
    }
</style>
