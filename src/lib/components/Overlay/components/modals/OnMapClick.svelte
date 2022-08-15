<script>
	import { _ } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import LoginTitle from "$lib/components/UI/LoginTitle.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import PrimaryAltButton from "$lib/components/UI/PrimaryAltButton.svelte";

	import { closeOverlays, openAnotherOverlay, registerAction, setCookie } from "$lib/utilities/helpers.js";
	import { appStateStore, userStateStore } from "../../../../../stores/state.js";
	import { poiReference, leafletReference } from "../../../../../stores/references.js";

	export let modalData;

	$: ({ coords } = modalData);
	$: L = $leafletReference;

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

<div
	class="fixed top-20 left-4 bg-white rounded-lg z-1 w-72 p-4"
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<LoginTitle
		title="Я хочу"
	/>

	<PrimaryAltButton
		text="Оценить это место для жизни"
		class="my-2"
		on:click={() => { openPopup("quizPopup") }}
	/>

	<PrimaryAltButton
		text="Добавить здесь примечательное место"
		class="my-2"
		on:click={openPOI}
	/>

	<PrimaryAltButton
		text="Рассказать интересную историю об этом месте"
		class="my-2"
	/>

	<PrimaryAltButton
		text="Посмотреть что здесь"
		class="my-2"
		on:click={() => openPopup("nearbyPopup")}
	/>

	<div class="text-txt_secondary">
		<p class="mb-2 mt-8">Подробнее:</p>

		<ul>
			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">О рейтингах</a></li>
			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">О примечательных местах</a></li>
			<li><a href="blog/tutorial" target="_blank" class="text-main py-0.5 transition-colors hover:bg-txt_tertiary">Об историях</a></li>
		</ul>
	</div>

	<CloseButton
		overlayType="modal"
		class="top-2 right-2"
	/>
</div>
