<script>
    import { browser } from '$app/env';
    import { getContext, onDestroy } from 'svelte';
    import { json, _, locale } from 'svelte-i18n';

    import PopupTitle from '../PopupTitle.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
    import Spinner from '../../../../ui-elements/Spinner.svelte';
    import PrimaryButton from '../../../../ui-elements/PrimaryButton.svelte';

    import { getSinglePointData } from "../../../../../utilities/api.js";
    import { mapReference, geocodeServiceReference } from "../../../../../../stores/references.js";
    import { appStateStore, userStateStore, overlayStateStore } from "../../../../../../stores/state.js";
    import { getFinalRating, roundToTen, roundToFifthDecimal, openAnotherOverlay } from '../../../../../utilities/helpers.js';

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
                // TODO: show notification
                console.warn(e);
            }
        }
    }

    const openCommentsSidebar = () =>
        openAnotherOverlay('commentsSidebar', commentGeoID);

    const fetchData = async ({ lng, lat }) => {
        geocodeService.reverse().latlng({ lng, lat }).language($locale).run((error, result) => {
            if (error) {
                console.warn(error);
                return;
            }
            approximateAdress = result.address.LongLabel;
        });
        // TODO:
        // $('.rate__popup').focus()
        const bounds = map.getBounds();
        const east = roundToFifthDecimal(bounds.getEast());
    	const west = roundToFifthDecimal(bounds.getWest());
        const distanceBetweenEdgesOfScreen = roundToFifthDecimal(Math.abs(east - west));
        const currentZoom = map.getZoom();
        const zoom = currentZoom <= 12 ? 13 : currentZoom;

        // center in left half of the screen
        map.setView({
            lng: lng + distanceBetweenEdgesOfScreen / 4,
            lat
        }, zoom);

        const { error, data } = await getSinglePointData([ lng, lat ]);
        console.log(error)
        console.log(data)
        const { properties } = data;
        loadedRating = properties['rating'];

        const ratingObj = properties.rating;
        const { finalRating } = getFinalRating(ratingObj);

        appStateStore.update(state => ({ ...state, showRating: [ lat, lng ] }));

        isAlreadyRatedByThisUser = properties.isRated;
        currentLatLng = { lng, lat };
        commentGeoID = properties.geoID;
        averageRating = roundToTen(finalRating);
        numberOfUsers = properties.numberOfUsers;
        numberOfComments = properties.numberOfComments;
        personalExperiencePercent = Math.floor(properties.numberOfPersonalExperience / properties.numberOfUsers * 100);

        // update comments if they opened
        if ($overlayStateStore.commentsSidebar.isOpen && $overlayStateStore.commentsSidebar.data !== commentGeoID)
            openAnotherOverlay('commentsSidebar', commentGeoID);
    }

    $: promise = fetchData(popupData);

    onDestroy(() => {
        appStateStore.update(state => ({ ...state, showRating: false }));
    })
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
