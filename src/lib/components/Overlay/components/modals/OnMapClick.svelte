<script>
	import { _ } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import LoginTitle from "$lib/components/UI/LoginTitle.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import MapModalButton from "$lib/components/UI/MapModalButton.svelte";

	import { closeOverlays, openAnotherOverlay, registerAction, setCookie } from "$lib/utilities/helpers.js";
	import { appStateStore, userStateStore, isDesktop } from "../../../../../stores/state.js";
	import { poiReference, leafletReference } from "../../../../../stores/references.js";

	export let modalData;

	$: ({ coords, pageX, pageY } = modalData);
	$: L = $leafletReference;
	$: dynamicPosition = `--top: ${pageY}px; --left: ${pageX}px`;

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
</script>

<style>
	.dynamicTop {
		left: var(--left);
		top: var(--top);
	}
</style>

<div
	class="fixed bg-bg_dark text-white rounded-lg z-1 w-72 p-4 -translate-y-full -md:z-5 -md:bottom-0 -md:top-auto -md:left-0 -md:translate-y-0 -md:w-full"
	class:dynamicTop={$isDesktop}
	style="{$isDesktop && dynamicPosition}"
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<LoginTitle
		title="Добавить"
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
		class="my-2"
	/>

<!--	<PrimaryAltButton-->
<!--		text="Посмотреть что здесь"-->
<!--		class="my-2"-->
<!--		on:click={() => openPopup("nearbyPopup")}-->
<!--	/>-->

<!--	<div class="text-txt_secondary">-->
<!--		<p class="mb-2 mt-8">Подробнее:</p>-->

<!--		<ul>-->
<!--			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">О рейтингах</a></li>-->
<!--			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">О примечательных местах</a></li>-->
<!--			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">Об историях</a></li>-->
<!--		</ul>-->
<!--	</div>-->

	<CloseButton
		overlayType="modal"
		class="top-2 right-2"
	/>
</div>
