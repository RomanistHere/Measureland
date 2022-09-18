<script>
	import { _ } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";
	import { onDestroy, onMount } from "svelte";

	import LoginTitle from "$lib/components/UI/LoginTitle.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import MapModalButton from "$lib/components/UI/MapModalButton.svelte";

	import {
		closeOverlays,
		drawCircle,
		removeCircle,
		openAnotherOverlay,
		registerAction,
		setCookie, debounce, closeOverlay,
	} from "$lib/utilities/helpers.js";
	import { appStateStore, userStateStore, isDesktop } from "../../../../../stores/state.js";
	import { poiReference, leafletReference, mapReference } from "../../../../../stores/references.js";

	export let modalData;

	$: ({ coords, pageX, pageY } = modalData);
	$: L = $leafletReference;
	$: dynamicPosition = `--top: ${pageY}px; --left: ${pageX}px`;
	
	const map = $mapReference;

	const openPopup = item => {
		closeOverlays();
		openAnotherOverlay(item, coords);
	};

	const getNumberOfNearbyPOIs = () => {
		try {
			const { lat, lng } = coords;
			const squareBounds = L.latLng(lat, lng).toBounds(500 * 2);
			const bounds = L.rectangle(squareBounds).getBounds();
			const bbox = [ bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
			const pointsOfInterestApprox = $poiReference.getClusters(bbox, 20);
			const numberOfPOIs = pointsOfInterestApprox.length;

			return {
				numberOfPOIs,
				pointsOfInterestApprox,
			};
		} catch (e) {
			return {
				numberOfPOIs: 0,
				pointsOfInterestApprox: [],
			};
		}
	};

	const openPOI = () => {
		const { numberOfPOIs, pointsOfInterestApprox } = getNumberOfNearbyPOIs();
		closeOverlays();

		if (numberOfPOIs === 0) {
			openPopup("addPOIPopup", coords);
		} else {
			openAnotherOverlay("warningPoiNearbyDialog", {
				latlng: coords,
				closePointsData: pointsOfInterestApprox,
			});
		}
	};

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
		drawCircle({ ...coords, map, radius: .2 });
		map.once("move", handleMovementWithPopupOpen);
	});
	onDestroy(() => {
		removeCircle({ map });
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
		title="Добавить"
		class="mt-0"
	/>

	<MapModalButton
		title="Оценку"
		description="Оценить конкретное место и прилегающий район по нескольким критериям"
		class="my-2"
		on:click={() => { openPopup("quizPopup") }}
	/>

	<MapModalButton
		title="Примечательное место"
		description="Оценить конкретное место и прилегающий район по нескольким критериям + Оценить конкретное место и прилегающий"
		class="my-2"
		on:click={openPOI}
	/>

	<MapModalButton
		title="Историю"
		description="Оценить конкретное место"
		class="mt-2"
	/>

<!--	<p class="my-2">или</p>-->

<!--	<MapModalButton-->
<!--			title="Посмотреть что здесь"-->
<!--			description="Оценить конкретное место"-->
<!--			class="mt-2"-->
<!--	/>-->

	<CloseButton
		overlayType="modal"
		isWhite={true}
		class="top-1 right-1"
	/>
</div>
