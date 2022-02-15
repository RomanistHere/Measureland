<script>
    import { browser } from '$app/env';
    import { onDestroy, onMount } from 'svelte';
    import { json, _, locale } from 'svelte-i18n';
    import { fade } from 'svelte/transition';

    import Timeline from './Timeline.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
    import Spinner from '../../../../ui-elements/Spinner.svelte';
    import PrimaryButton from '../../../../ui-elements/PrimaryButton.svelte';
    import SecondaryButton from '../../../../ui-elements/SecondaryButton.svelte';

    import { getSinglePointData } from "../../../../../utilities/api.js";
    import { mapReference, geocodeServiceReference } from "../../../../../../stores/references.js";
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

    export let popupData;

    const map = $mapReference;
    const geocodeService = $geocodeServiceReference;

    let isAlreadyRatedByThisUser = false;
    let openedTab = 'ratings';
    let averageRating = '';
    let numberOfUsers = '';
    let numberOfComments = '';
    let personalExperiencePercent = 100;
    let shouldShowURLCopySuccess = false;
    let commentGeoID = null;
    let currentLatLng = null;
    let loadedRating = null;
    let circle = null;
    let timelineData = [];
    let currentCoords = { lat: 0, lng: 0 };

    $: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
    $: isUserLoggedIn = $userStateStore.userID !== null;
    $: promise = null;
    $: averageAQI = null;
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
    };

    const fetchData = async ({ lng, lat }) => {
    	geocodeService.reverse().latlng({ lng, lat }).language($locale).run((error, result) => {
    		if (error) {
    			logError(error);
    			return;
    		}
    		approximateAdress = result.address.LongLabel;
    	});

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

    onMount(async () => {
	    // const data = await fetch(`https://api.waqi.info/feed/geo:${popupData.lat};${popupData.lng}/?token=dae93ad4b135f627cf146b641b1820ab0395d9c8`);
	    // const parsedData = await data.json();
	    // const aqi = parsedData.data.aqi;
	    // console.log(parsedData)
	    // console.log(aqi);
	    // const anotherData = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${popupData.lat}&lon=${popupData.lng}&appid=1387a4c3445d5f7c3e3d3793eb75cb53`);
	    // const parsedData2 = await anotherData.json();
	    // const aqi2 = parsedData2.list[0].main.aqi;
	    // console.log(parsedData2);
	    // console.log(aqi2);

	    const prevYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
	    const prevYearUnix = Math.floor(prevYear.getTime() / 1000);
	    // todo: move somewhere else
	    const apiKey = '1387a4c3445d5f7c3e3d3793eb75cb53';
	    const histData = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${popupData.lat}&lon=${popupData.lng}&start=${prevYearUnix}&end=${Date.now()}&appid=${apiKey}`);
	    const histDataParsed = await histData.json();
	    const sum = histDataParsed.list.reduce((a, item) => a + item.main.aqi, 0);
	    // 1 - good, 5 - bad
	    const averageAirPollution = Math.round(sum / histDataParsed.list.length);
	    // convert to 1 - bad, 5 good
	    averageAQI = [ 5, 4, 3, 2, 1 ][averageAirPollution - 1];
    });

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
	
	<div class="text-center -mt-2">
		<a
			href={"#"}
			on:click|preventDefault={switchTabToRatings}
			class="inline-block origin-right transition-transform"
			class:text-active={openedTab === 'ratings'}
			class:scale-125={openedTab === 'ratings'}
		>
			Оценки
		</a>
		|
		<a
			href={"#"}
			on:click|preventDefault={switchTabToMeasurements}
			class="inline-block origin-left transition-transform"
			class:text-active={openedTab === 'measurements'}
			class:scale-125={openedTab === 'measurements'}
		>
			Измерения
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
				<ShowRatingPopupItem
					title="Чистота воздуха"
					tooltip="Данные основаны на среднем индексе чистоты воздуха за год: openweathermap.org"
					rating={averageAQI}
				/>
			</div>
		{/if}
	</div>

    <a href={"#"} class="block text-right my-4 underline" on:click|preventDefault={copyShareRatingURL}>
        {#if shouldShowURLCopySuccess}
            {$_('showRatingPopup.copied')}
        {:else}
            {$_('showRatingPopup.shareThisRating')}
        {/if}
    </a>

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
            <a href={"#"} class="underline" on:click|preventDefault={checkCommentsRelevanceAndOpen}>{$_('showRatingPopup.comments')}</a>:
            <span class="sug-col font-bold text-2xl -md:text-lg">{numberOfComments}</span>
        </div>
    </div>

    <Timeline { timelineData } />

    <div class="flex justify-evenly items-center mt-4">
        <SecondaryButton text={$_('showRatingPopup.showNearbyRatings')} action={() => openAnotherOverlay('nearbyPopup', currentLatLng)} />
        {#if isUserLoggedIn && isAlreadyRatedByThisUser}
            <PrimaryButton text={$_('showRatingPopup.youHaveAlreadyRated')} disabled={true} />
        {:else if isUserLoggedIn && !isAlreadyRatedByThisUser}
            <PrimaryButton text={$_('showRatingPopup.addNewRating')} action={() => openAnotherOverlay('quizPopup', currentLatLng)} />
        {:else}
            <PrimaryButton text={$_('showRatingPopup.loginAndRate')} action={() => openAnotherOverlay('loginPopup')} />
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
