<script>
	import { _ } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";
	import { onDestroy, onMount } from "svelte";

	import LoginTitle from "$lib/components/UI/LoginTitle.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import MapModalButton from "$lib/components/UI/MapModalButton.svelte";
	import PercentageBar from "$lib/components/UI/PercentageBar.svelte";

	import {
		closeOverlays,
		openAnotherOverlay,
		registerAction,
		setCookie,
		debounce,
		closeOverlay,
	} from "$lib/utilities/helpers.js";
	import { appStateStore, userStateStore, isDesktop } from "../../../../../stores/state.js";
	import { poiReference, leafletReference, mapReference } from "../../../../../stores/references.js";

	export let modalData;

	$: ({ country, pageX, pageY } = modalData);
	$: L = $leafletReference;
	$: dynamicPosition = `--top: ${pageY}px; --left: ${pageX}px`;
	
	const map = $mapReference;

	const adjustPosition = node => {
		if (typeof document === "undefined")
			return;

		const bodyBounds = document.body.getBoundingClientRect();
		const popupBounds = node.getBoundingClientRect();

		const tooRight = popupBounds.left + popupBounds.width + 20 > bodyBounds.right;
		const tooHigh = popupBounds.bottom - popupBounds.height - 50 < bodyBounds.top;

		if (tooRight)
			dynamicPosition = `--top: ${pageY}px; --left: ${pageX - popupBounds.width}px`;

		if (tooHigh)
			dynamicPosition = `--top: ${pageY + popupBounds.height}px; --left: ${pageX}px`;

		if (tooRight && tooHigh)
			dynamicPosition = `--top: ${pageY + popupBounds.height}px; --left: ${pageX - popupBounds.width}px`;
	};

	const handleMovementWithPopupOpen = () => {
		closeOverlay("modal");
	};

	onMount(() => {
		map.once("move", handleMovementWithPopupOpen);
	});
	onDestroy(() => {
		map.off("move", handleMovementWithPopupOpen);
	});
</script>

<style>
	.dynamicTop {
		left: var(--left);
		top: var(--top);
	}
</style>

<div
	class="fixed bg-bg_dark text-white rounded-xl z-1 w-72 p-4 -translate-y-full -md:z-5 -md:bottom-0 -md:top-auto -md:left-0 -md:translate-y-0 -md:w-full"
	class:dynamicTop={$isDesktop}
	style="{$isDesktop && dynamicPosition}"
	use:focusTrap
	use:adjustPosition
	in:fly="{{ y: 50, duration: 300 }}"
	out:fly="{{ y: 50, duration: 300 }}"
>
	<LoginTitle
		title={country}
		class="mt-0 mb-1"
	/>

	<p class="text-[#9A9AA7] mt-2">
		качество жизни
	</p>

	<PercentageBar
		class="mb-4 mt-1"
		text="высокое"
		value={85}
	/>

	<MapModalButton
		title="Больше показателей"
		class="mt-2"
	/>

	<CloseButton
		overlayType="modal"
		isWhite={true}
		class="top-1 right-1"
	/>
</div>
