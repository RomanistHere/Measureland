<script>
    import { browser } from '$app/env';
    import { onDestroy } from 'svelte';
    import { json, _, locale } from 'svelte-i18n';

    import Timeline from './Timeline.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
    import Spinner from '../../../../ui-elements/Spinner.svelte';
    import PrimaryButton from '../../../../ui-elements/PrimaryButton.svelte';

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

    $: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;
    // complexity because of translation
    $: criteriaArray = loadedRating === null
    	? Object.entries($json('criteria')).map(([ key, value ]) => ({ ...value, key, rating: 0 }))
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
    	openAnotherOverlay('commentsSidebar', commentGeoID);

    const fetchData = async({ lng, lat }) => {
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
    	if ($overlayStateStore.commentsSidebar.isOpen && $overlayStateStore.commentsSidebar.data !== commentGeoID)
    		openAnotherOverlay('commentsSidebar', commentGeoID);
    };

    $: promise = fetchData(popupData);

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

    <ul>
        {#each criteriaArray as item}
            <ShowRatingPopupItem { ...item } />
        {/each}
    </ul>

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
            <a href={"#"} class="underline" on:click|preventDefault={openCommentsSidebar}>{$_('showRatingPopup.comments')}</a>:
            <span class="sug-col font-bold text-2xl -md:text-lg">{numberOfComments}</span>
        </div>
    </div>

    <Timeline { timelineData } />

    <div class="flex justify-evenly items-center mt-4">
        {#if isUserLoggedIn && isAlreadyRatedByThisUser}
            <PrimaryButton text={$_('showRatingPopup.youHaveAlreadyRated')} disabled={true} />
        {:else if isUserLoggedIn && !isAlreadyRatedByThisUser}
            <PrimaryButton text='{$_('showRatingPopup.addNewRating')}' action={() => openAnotherOverlay('quizPopup', currentLatLng)} />
        {:else}
            <PrimaryButton text='{$_('showRatingPopup.loginAndRate')}' action={() => openAnotherOverlay('loginPopup')} />
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
