<script>
    import { browser } from '$app/env';
    import { getContext, onDestroy } from 'svelte';
    import { json, _, locale } from 'svelte-i18n';

    import PopupWrap from '../PopupWrap.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
    import Spinner from '../../../../Spinner.svelte';
    import MainButton from '../../MainButton.svelte';

    import { getSinglePointData } from "../../../../../utilities/api.js";
    import { mapReference, geocodeServiceReference } from "../../../../../../stores/references.js";
    import { appStateStore, userStateStore } from "../../../../../../stores/state.js";
    import { criteria } from '../../../../../constants/criteria.js';
    import { getFinalRating, roundToTen, openAnotherOverlay } from '../../../../../utilities/helpers.js';

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

        const currentZoom = map.getZoom();
        const zoom = currentZoom <= 12 ? 13 : currentZoom;
        map.setView({ lng, lat }, zoom);

        const { error, data } = await getSinglePointData([ lng, lat ]);
        console.log(error)
        console.log(data)
        const { properties } = data;
        loadedRating = properties['rating'];

        const ratingObj = properties.rating;
        const { finalRating } = getFinalRating(ratingObj);

        appStateStore.update(state => ({ ...state, showRating: true }));
        
        isAlreadyRatedByThisUser = properties.isRated;
        currentLatLng = { lng, lat };
        commentGeoID = properties.geoID;
        averageRating = roundToTen(finalRating);
        numberOfUsers = properties.numberOfUsers;
        numberOfComments = properties.numberOfComments;
        personalExperiencePercent = Math.floor(properties.numberOfPersonalExperience / properties.numberOfUsers * 100);
    }

    let promise = fetchData(popupData);

    onDestroy(() => {
        appStateStore.update(state => ({ ...state, showRating: false }));
    })
</script>

<PopupWrap className='rate__wrap'>
    <div class="rating__popup rating__popup-active rate__popup">
        <div class="adress_bar">
            {$_('showRatingPopup.approximateAddress')}: {approximateAdress}
        </div>
        <ul class="rating__list">
            {#each criteriaArray as item}
                <ShowRatingPopupItem { ...item } />
            {/each}
        </ul>

        <a href={"#"} class="rate__link_btn" on:click|preventDefault={copyShareRatingURL}>
            {#if shouldShowURLCopySuccess}
                {$_('showRatingPopup.copied')}
            {:else}
                {$_('showRatingPopup.shareThisRating')}
            {/if}
        </a>

        <div class="rate__caption" title="{$_('showRatingPopup.howMuchPeople')}">
            {personalExperiencePercent}% {$_('showRatingPopup.ofParticipantsLived')}
        </div>
    </div>

    <div class="rate__container">
        <div class="rate__container_item">
            <span>{$_('showRatingPopup.averageRating')}: </span>
            <span class="rate__highlight">{averageRating}</span>
        </div>
        <div class="rate__container_item">
            <span>{$_('showRatingPopup.usersRated')}: </span>
            <span class="rate__highlight">{numberOfUsers}</span>
        </div>
        <div class="rate__container_item">
            <a href={"#"} class="rate__comments" on:click|preventDefault={openCommentsSidebar}>{$_('showRatingPopup.comments')}</a>:
            <span class="rate__highlight">{numberOfComments}</span>
        </div>
    </div>

    {#if isUserLoggedIn && isAlreadyRatedByThisUser}
        <div href={"#"} class="rate__evaluate btn rate__rated_btn">{$_('showRatingPopup.youHaveAlreadyRated')}</div>
    {:else if isUserLoggedIn && !isAlreadyRatedByThisUser}
        <MainButton text='{$_('showRatingPopup.addNewRating')}' action={() => openAnotherOverlay('quizPopup', currentLatLng)} />
    {:else}
        <MainButton text='{$_('showRatingPopup.loginAndRate')}' action={() => openAnotherOverlay('loginPopup')} />
    {/if}

    {#await promise}
        <Spinner />
    {/await}
</PopupWrap>

<style>

</style>
