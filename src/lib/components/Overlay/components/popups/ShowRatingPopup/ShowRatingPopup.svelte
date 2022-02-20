<script>
	import { browser } from '$app/env';
	import { onDestroy } from 'svelte';
	import { json, _, locale } from 'svelte-i18n';
	import { fade } from 'svelte/transition';

	import Timeline from './Timeline.svelte';
	import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
	import ShowLoadedRatingPopupItem from './ShowLoadedRatingPopupItem.svelte';
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import PrimaryButton from '../../../../ui-elements/PrimaryButton.svelte';
	import SecondaryButton from '../../../../ui-elements/SecondaryButton.svelte';
	import TextButton from '../../../../ui-elements/TextButton.svelte';

	import { getSinglePointData } from "../../../../../utilities/api.js";
	import { mapReference } from "../../../../../../stores/references.js";
	import { appStateStore, userStateStore, overlayStateStore, isDesktop } from "../../../../../../stores/state.js";
	import {
		getFinalRating,
		roundToTen,
		openAnotherOverlay,
		centerMap,
		showSomethingWrongNotification,
		registerAction,
		logError,
	} from '../../../../../utilities/helpers.js';
	import {
		fetchDisasterRisk,
		fetchWaqi,
		fetchOpenWeather,
	} from '../../../../../utilities/externalApi.js';

	export let popupData;

	const map = $mapReference;

	let isAlreadyRatedByThisUser = false;
	let openedTab = 'ratings';
	let averageRating = '';
	let numberOfUsers = '';
	let numberOfComments = '';
	let personalExperiencePercent = 100;
	let shouldShowURLCopySuccess = false;
	let isAirQualityDataLoaded = false;
	let commentGeoID = null;
	let currentLatLng = null;
	let loadedRating = null;
	let circle = null;
	let country = null;
	let timelineData = [];
	let currentCoords = { lat: 0, lng: 0 };

	$: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
	$: isUserLoggedIn = $userStateStore.userID !== null;
	$: promise = null;
	$: averageAQI = null;
	$: averageWAQI = null;
	$: averageSafetyValue = null;
	$: copyLinkState = shouldShowURLCopySuccess ? $_('showRatingPopup.copied') : $_('showRatingPopup.shareThisRating');
	// complexity because of translation
	$: criteriaArray = loadedRating === null
		? Object.entries($json('criteria')).map(([ key, value ]) => ({ ...value, rating: 0 }))
		: Object.entries(loadedRating).map(([ key, value ]) => ({ ...$json('criteria')[key], rating: value }));

	const copyShareRatingURL = () => {
		if (browser && !shouldShowURLCopySuccess) {
			const shareRatingURL = new URL(window.location.href).toString();
			try {
				navigator.clipboard.writeText(shareRatingURL);
				shouldShowURLCopySuccess = true;
				setTimeout(() => { shouldShowURLCopySuccess = false }, 1000);
			} catch (e) {
				logError(e);
				showSomethingWrongNotification();
			}
		}
		registerAction('clickCopyURLButton');
	};

	const openCommentsSidebar = () =>
		openAnotherOverlay('commentsSidebar', { id: commentGeoID, type: 'rating' });

	const checkCommentsRelevanceAndOpen = () => {
		if (!$overlayStateStore.commentsSidebar.isOpen)
			openCommentsSidebar();
	};

	const switchTabToRatings = () => {
		openedTab = 'ratings';
	};

	const switchTabToMeasurements = () => {
		openedTab = 'measurements';
		if (!isAirQualityDataLoaded) {
			getAirQualityData();
		}
	};

	const fetchData = async ({ lng, lat }) => {
		const geoCoding = await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.5898de479bcc688559fd050896450d49&lat=${lat}&lon=${lng}&format=json&accept-language=${$locale}`);
		const { address } = await geoCoding.json();
		const { road, city } = address;
		const regionNamesInEnglish = new Intl.DisplayNames([ 'en' ], { type: 'region' });
		approximateAdress = `${road || ''}, ${address.house_number || ''}. ${city || ''}, ${address.country || ''}`;
		country = regionNamesInEnglish.of(address.country_code.toUpperCase());

		if (circle)
			map.removeLayer(circle);

		// eslint-disable-next-line no-undef
		circle = L.circle({ lng, lat }, 300, { color: '#007097' });

		circle.addTo(map);
		centerMap(map, lat, lng, $isDesktop);

		const { error, data } = await getSinglePointData([ lng, lat ]);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		const { properties } = data;
		const { timeline, isRated, geoID, numberOfPersonalExperience } = properties;
		loadedRating = properties['rating'];
		const { finalRating } = getFinalRating(loadedRating);

		appStateStore.update(state => ({ ...state, showRating: [ lat, lng ] }));

		timelineData = timeline;
		isAlreadyRatedByThisUser = isRated;
		currentLatLng = { lng, lat };
		commentGeoID = geoID;
		averageRating = roundToTen(finalRating);
		numberOfUsers = properties.numberOfUsers;
		numberOfComments = properties.numberOfComments;
		personalExperiencePercent = Math.floor(numberOfPersonalExperience / properties.numberOfUsers * 100);

		// update comments if they opened
		if ($overlayStateStore.commentsSidebar.isOpen && $overlayStateStore.commentsSidebar.data.id !== commentGeoID)
			openCommentsSidebar();
	};

	// need to check in order not to do unnecessary requests.
	$: if (currentCoords.lat !== popupData.lat && currentCoords.lng !== popupData.lng) {
		promise = fetchData(popupData);
		currentCoords = { ...popupData };
	}

	const getDataApi1 = async () => {
		averageSafetyValue = await fetchDisasterRisk(country);
	};

	const getDataApi2 = async (lat, lng) => {
		averageWAQI = await fetchWaqi(lat, lng);
	};

	const getDataApi3 = async (lat, lng) => {
		averageAQI = await fetchOpenWeather(lat, lng);
	};

	const getAirQualityData = async () => {
		isAirQualityDataLoaded = false;
		const { lat, lng } = popupData;

		getDataApi1();
		getDataApi2(lat, lng);
		getDataApi3(lat, lng);

		isAirQualityDataLoaded = true;
	};

	onDestroy(() => {
		appStateStore.update(state => ({ ...state, showRating: false }));
		map.removeLayer(circle);
		circle = null;
	});
</script>

<div class="max-w-lg w-full">
	<p class="mb-4 text-center italic text-base font-bold -md:px-10">
		{$_('showRatingPopup.approximateAddress')}: {approximateAdress}
	</p>

	<div class="text-center py-1 md:-mt-2 bg-text text-white flex justify-evenly rounded-md">
		<a
			href={"#"}
			on:click|preventDefault={switchTabToRatings}
			class="inline-block py-1 px-12 rounded-md transition-color duration-300 border -md:px-6"
			class:bg-active={openedTab === 'ratings'}
			class:hover:border-white={openedTab !== 'ratings'}
			class:border-transparent={openedTab !== 'ratings'}
		>
			{$_('showRatingPopup.tabRatingsBtn')}
		</a>
		<a
			href={"#"}
			on:click|preventDefault={switchTabToMeasurements}
			class="inline-block py-1 px-12 rounded-md transition-color duration-300 border -md:px-6"
			class:bg-active={openedTab === 'measurements'}
			class:hover:border-white={openedTab !== 'measurements'}
			class:border-transparent={openedTab !== 'measurements'}
		>
			{$_('showRatingPopup.tabMeasurementsBtn')}
		</a>
	</div>

	<div class="relative">
		<ul
			class:opacity-0={openedTab === 'measurements'}
			class="transition-opacity"
		>
			{#each criteriaArray as item}
				<ShowRatingPopupItem { ...item } />
			{/each}
		</ul>
		{#if openedTab === 'measurements'}
			<div
				class="absolute inset-x-0 -top-3"
				transition:fade
			>
				<ShowLoadedRatingPopupItem
					title={$_('showRatingPopup.airQualityLoadedTitle')}
					linkText="openweathermap.org"
					link="https://openweathermap.org/api/air-pollution"
					tooltip={$_('showRatingPopup.descriptionOWM')}
					rating={averageAQI}
				/>
				<ShowLoadedRatingPopupItem
					title={$_('showRatingPopup.airQualityLoadedTitle')}
					linkText="waqi.info"
					link="https://waqi.info/"
					tooltip={$_('showRatingPopup.descriptionWAQI')}
					rating={averageWAQI}
				/>
				<ShowLoadedRatingPopupItem
					title={$_('showRatingPopup.naturalDisasterTitle')}
					linkText="wikipedia.org"
					link="https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk"
					tooltip={$_('showRatingPopup.descriptionNaturalDisaster')}
					rating={averageSafetyValue}
				/>
			</div>
		{/if}
	</div>

	<div class="text-right my-4">
		<TextButton
			text={copyLinkState}
			action={copyShareRatingURL}
		/>
	</div>

	<div class="italic text-sm font-bold" title="{$_('showRatingPopup.howMuchPeople')}">
		{personalExperiencePercent}% {$_('showRatingPopup.ofParticipantsLived')}
	</div>

	<div class="flex justify-between my-4 -md:text-sm">
		<div>
			{$_('showRatingPopup.averageRating')}:
			<span class="sug-col font-bold text-2xl -md:text-lg">{averageRating}</span>
		</div>
		<div>
			{$_('showRatingPopup.usersRated')}:
			<span class="sug-col font-bold text-2xl -md:text-lg">{numberOfUsers}</span>
		</div>
		<div>
			<TextButton
				text={$_('showRatingPopup.comments')}
				action={checkCommentsRelevanceAndOpen}
			/>:
			<span class="sug-col font-bold text-2xl -md:text-lg">{numberOfComments}</span>
		</div>
	</div>

	<Timeline { timelineData } />

	<div class="flex justify-evenly items-center mt-4">
		<SecondaryButton
			text={$_('showRatingPopup.showNearbyRatings')}
			action={() => openAnotherOverlay('nearbyPopup', currentLatLng)}
		/>
		{#if isUserLoggedIn && isAlreadyRatedByThisUser}
			<PrimaryButton
				text={$_('showRatingPopup.youHaveAlreadyRated')}
				disabled={true}
			/>
		{:else if isUserLoggedIn && !isAlreadyRatedByThisUser}
			<PrimaryButton
				text={$_('showRatingPopup.addNewRating')}
                action={() => openAnotherOverlay('quizPopup', currentLatLng)}
			/>
		{:else}
			<PrimaryButton
				text={$_('showRatingPopup.loginAndRate')}
				action={() => openAnotherOverlay('loginPopup')}
			/>
		{/if}
	</div>


	{#await promise}
		<Spinner
			className="absolute w-full h-full inset-0 z-5"
			isWithText={true}
			isWithBg={true}
		/>
	{/await}
</div>
