<script>
    import PopupWrap from '../PopupWrap.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';

    import { criteria } from '../../../../constants/criteria.js';
    import { _ } from 'svelte-i18n';
    console.log($_)

    const criteriaArray = Object.values(criteria).map(item => item);
</script>

<PopupWrap>
    <div class="rating rate">
        <div class="rating__wrap rate__wrap">
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
                    <span class="ratePersonalExperience">100</span>% of the participants lived nearby
                </div>
            </div>
            <a href={"#"} class="rating__close rateClose">
                <span class="close"></span>
            </a>

            <div class="rate__container">
                <div class="rate__container_item">
                    <span class="rateText1">Av. rating: </span>
                    <span class="rate__highlight rateAverageRating"> </span>
                </div>
                <div class="rate__container_item">
                    <span class="rateText2">Users rated: </span>
                    <span class="rate__highlight rateNumberOfUsers"> </span>
                </div>
                <div class="rate__container_item">
                    <a href={"#"} class="rate__comments rateText3">Comments</a>:
                    <span class="rate__highlight rateNumberOfComments"> </span>
                </div>
            </div>
            <a href={"#"} class="rate__evaluate btn loggedInShow addEvaluation">Add new rating</a>
            <a href={"#"} class="rate__evaluate btn btn-hide rate__rated_btn">You have already rated this place</a>
            <a href={"#"} class="rate__evaluate btn loggedOutShow loggedOutShow-show openLoginFromRatings">Login and rate</a>

            <div class="spinner__wrap rate__spinner">
                <div class="spinner__centr">
                    <div class="spinner"></div>
                    <p class="spinner__text">Loading</p>
                </div>
            </div>
        </div>
    </div>


</PopupWrap>

<style>

</style>
