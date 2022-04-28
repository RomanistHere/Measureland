<script>
	import { _ } from 'svelte-i18n';

	import { closeOverlay, openAnotherOverlay, registerAction, setCookie } from "$lib/utilities/helpers.js";
	import { appStateStore, userStateStore } from "../../../../../stores/state.js";
	import { poiReference, leafletReference } from "../../../../../stores/references.js";

	export let dialogData;

	$: L = $leafletReference;
	$: isUserLoggedIn = $userStateStore.userID !== null;

	const openPopup = item => {
		closeOverlay('dialog');
		openAnotherOverlay(item, dialogData);
	};

	const openPOI = () => {
		const { lat, lng } = dialogData;

		const squareBounds = L.latLng(lat, lng).toBounds(500 * 2);
		const bounds = L.rectangle(squareBounds).getBounds();
		const bbox = [ bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
		const pointsOfInterestApprox = $poiReference.getClusters(bbox, 20);
		const numberOfPOIs = pointsOfInterestApprox.length;

		if (numberOfPOIs === 0) {
			openPopup('addPOIPopup');
		} else {
			openAnotherOverlay('warningPoiNearbyDialog', {
				latlng: dialogData,
				closePointsData: pointsOfInterestApprox,
			});
		}
	};

	const closeStartScreen = () => {
		const { termsOfUseAgreed, startScreen } = $appStateStore;
		if (!startScreen || !termsOfUseAgreed)
			return;

		appStateStore.update(state => ({ ...state, startScreen: false }));
		setCookie('startScreen', '0', 365);
		registerAction('dialogCloseStartScreen');
	};

	const openRegister = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		closeOverlay('dialog');
		openAnotherOverlay('registerPopup');
		registerAction('dialogRegister');
	};

	const openLogin = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		closeOverlay('dialog');
		openAnotherOverlay('loginPopup');
		registerAction('dialogLogin');
	};
</script>

{#if isUserLoggedIn}
	<h3 class="text-2xl -md:text-lg pr-6">
		{$_('onMapClickDialog.title')}
	</h3>

	<p class="mt-2">
		<a href="blog/tutorial" target="_blank" class="underline">
			{$_('onMapClickDialog.subtitleLink')}
		</a>
		{$_('onMapClickDialog.subtitleText')}
	</p>

	<div class="flex -mx-1 mt-4">
		<a
			href={'#'}
			class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
			on:click|preventDefault|stopPropagation={() => { openPopup('quizPopup') }}
		>
			<div class="text-center">
				<img
					src="/images/rating_icon.svg"
					alt={$_('onMapClickDialog.option1Alt')}
					class="h-24 inline-block my-2"
				>
			</div>
			{$_('onMapClickDialog.option1')}
		</a>
		<a
			href={'#'}
			class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
			on:click|preventDefault|stopPropagation={openPOI}
		>
			<div class="text-center">
				<img
					src="/images/attention.svg"
					alt={$_('onMapClickDialog.option2Alt')}
					class="h-24 inline-block my-2"
				>
			</div>
			{$_('onMapClickDialog.option2')}
		</a>
	</div>
{:else}
	<h3 class="text-2xl -md:text-lg pr-6">
		{$_('onMapClickDialog.alternativeTitle')}
	</h3>

	<p class="mt-2">
		{$_('onMapClickDialog.alternativeDesc1')}
	</p>
	<p>
		{$_('onMapClickDialog.alternativeDesc2')}
	</p>
	<div class="flex -mx-1 mt-4">
		<a
			href={'#'}
			class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
			on:click|preventDefault|stopPropagation={openRegister}
		>
			{$_('onMapClickDialog.alternativeBtn1')}
		</a>
		<a
			href={'#'}
			class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
			on:click|preventDefault|stopPropagation={openLogin}
		>
			{$_('onMapClickDialog.alternativeBtn2')}
		</a>
	</div>
{/if}

<style>
	@media (hover: hover) and (pointer: fine) {
		a:hover {
			background-color: var(--active-color);
			color: var(--side-bg-color);
		}

		img {
			transition: transform ease .5s;
		}

		a:hover img {
			transform: translateY(-5px);
		}
	}
</style>
