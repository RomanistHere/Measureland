<script>
    import PopupWrap from '../PopupWrap.svelte';
    import ShowRatingPopupItem from './ShowRatingPopupItem.svelte';

    let items = [
        { title: 'title1', tooltip: 'tooltip1' },
        { title: 'title2', tooltip: 'tooltip2' },
        { title: 'title3', tooltip: 'tooltip3', side: 'left' },
        { title: 'title4', tooltip: 'tooltip4' },
        { title: 'title5', tooltip: 'tooltip5' },
        { title: 'title6', tooltip: 'tooltip6' },
        { title: 'title7', tooltip: 'tooltip7' },
        { title: 'title8', tooltip: 'tooltip8' },
        { title: 'title9', tooltip: 'tooltip9' },
        { title: 'title10', tooltip: 'tooltip10' },
        { title: 'title11', tooltip: 'tooltip11' },
	];
</script>

<PopupWrap>
    <div class="rating rate">
        <div class="rating__wrap rate__wrap">
            <div class="rating__popup rating__popup-active rate__popup" tabindex="0">
                <div class="adress_bar">
                    Approximate address: <span class="adress_bar__string">calculating...</span>
                </div>
                <ul class="rating__list">
                    {#each items as item}
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
