<script>
    import { getContext } from 'svelte';

    import PopupWrap from '../PopupWrap.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';
    import Spinner from '../../../Spinner.svelte';

    import { getSinglePointData } from "../../../../utilities/api.js";
    import { criteria } from '../../../../constants/criteria.js';
    import { _ } from 'svelte-i18n';

    console.log(getContext('MEASURELAND_MAP'))
    const { getMap } = getContext('MEASURELAND_MAP');
	const map = getMap();

    export let popupData;
    let averageRating = '';
    let numberOfUsers = '';
    let numberOfComments = '';
    let personalExperiencePercent = 100;

    let criteriaArray = Object.entries($_('criteria')).map(([ key, value ]) => ({ ...value, key, rating: 0 }));
    console.log(criteriaArray)

    const sleep = milliseconds =>
        new Promise(resolve => setTimeout(resolve, milliseconds))

    const fetchData = async ({ lng, lat }) => {
        // await sleep(2000);
        // TODO:
        // fillAdress(latlng)
        // $('.rate__popup').focus()

        // const zoom = state.zoom <= 12 ? 13 : state.zoom;
        const zoom = map.getZoom();
        console.log(zoom)
        map.setView({ lng, lat }, zoom);

        const { error, data } = await getSinglePointData([ lng, lat ]);
        console.log(error)
        console.log(data)
        const { properties } = data;
        criteriaArray = Object.entries(properties['rating']).map(([ key, value ]) => ({
            ...$_('criteria')[key],
            rating: value
        }));

        // averageRating = roundToTen(finalRating)
        numberOfUsers = properties.numberOfUsers;
        numberOfComments = properties.numberOfComments;
        personalExperiencePercent = Math.floor(properties.numberOfPersonalExperience / properties.numberOfUsers * 100);
    }

    let promise = fetchData(popupData);
</script>

<PopupWrap className='rate__wrap'>
    <div class="rating__popup rating__popup-active rate__popup" tabindex="0">
        <div class="adress_bar">
            Approximate address: <span class="adress_bar__string">calculating...</span>
        </div>
        <ul class="rating__list">
            {#each criteriaArray as item}
                <ShowRatingPopupItem { ...item } />
            {/each}
        </ul>

        <a href={"#"} class="rate__link_btn">
            <span class="rate__link_btn-copy">Share this rating</span>
            <span class="rate__link_btn-copied">Copied</span>
        </a>

        <div class="rate__caption" title="How much people are actually lived here">
            {personalExperiencePercent} % of the participants lived nearby
        </div>
    </div>

    <div class="rate__container">
        <div class="rate__container_item">
            <span class="rateText1">Av. rating: </span>
            <span class="rate__highlight">{averageRating}</span>
        </div>
        <div class="rate__container_item">
            <span class="rateText2">Users rated: </span>
            <span class="rate__highlight">{numberOfUsers}</span>
        </div>
        <div class="rate__container_item">
            <a href={"#"} class="rate__comments rateText3">Comments</a>:
            <span class="rate__highlight">{numberOfComments}</span>
        </div>
    </div>
    <a href={"#"} class="rate__evaluate btn loggedInShow addEvaluation">Add new rating</a>
    <a href={"#"} class="rate__evaluate btn btn-hide rate__rated_btn">You have already rated this place</a>
    <a href={"#"} class="rate__evaluate btn loggedOutShow loggedOutShow-show openLoginFromRatings">Login and rate</a>

    {#await promise}
        <Spinner />
    {/await}
</PopupWrap>

<style>

</style>
