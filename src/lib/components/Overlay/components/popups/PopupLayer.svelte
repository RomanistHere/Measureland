<script>
    import { closeOverlays } from '../../../../utilities/helpers.js';

    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';
    import QuizPopup from './QuizPopup/QuizPopup.svelte';
    import HowToRatePopup from './HowToRatePopup.svelte';
    import LoggedInPopup from './LoggedInPopup.svelte';
    import RegisterPopup from './RegisterPopup.svelte';
    import PartnersPopup from './PartnersPopup.svelte';
    import MyPlacesPopup from './MyPlacesPopup.svelte';
    import LoginPopup from './LoginPopup.svelte';

    export let popupName;
    export let popupData;

    const popupList = {
        // changePasswordPopup: PopupLayer,
        // forgotPasswordPopup: PopupLayer,
        howToRatePopup: {
            className: 'rate_tutorial',
            component: HowToRatePopup
        },
        loggedInPopup: {
            className: 'login',
            component: LoggedInPopup
        },
        loginPopup: {
            className: 'login',
            component: LoginPopup
        },
        myPlacesPopup: {
            className: 'places',
            component: MyPlacesPopup
        },
        partnersPopup: {
            className: 'partners',
            component: PartnersPopup
        },
        quizPopup: {
            className: 'rating ratingShow',
            component: QuizPopup
        },
        registerPopup: {
            className: 'register',
            component: RegisterPopup
        },
        showRatingsPopup: {
            className: 'rate',
            component: ShowRatingPopup
        },
    };

    const closePopups = e =>
        (e.target === e.currentTarget) ? closeOverlays() : false;

    $: Popup = popupList[popupName]['component'];
    $: popupParentClass = popupList[popupName]['className']
</script>

<div class="rating {popupParentClass}" on:click|preventDefault={closePopups}>
    <svelte:component this={Popup} { popupData }/>
</div>

<style>
    /* div {
        position: fixed;
        z-index: 1;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        opacity: 1;
        background-color: rgba(0, 0, 0, .2);
        transition: opacity .5s;

        font-size: var(--normal-fz);
    } */
    div {
        opacity: 1;
        z-index: 1;
    }
</style>
