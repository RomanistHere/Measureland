<script>
    import { closeOverlays } from '../../../utilities/helpers.js';

    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';
    import LoginPopup from './LoginPopup.svelte';
    import RegisterPopup from './RegisterPopup.svelte';

    export let popupName;
    export let popupData;

    const popupList = {
        loginPopup: LoginPopup,
        registerPopup: RegisterPopup,
        // forgotPasswordPopup: PopupLayer,
        // changePasswordPopup: PopupLayer,
        showRatingsPopup: ShowRatingPopup,
        // quizPopup: PopupLayer,
    };

    const closePopups = e =>
        (e.target === e.currentTarget) ? closeOverlays() : false;

    $: Popup = popupList[popupName];
</script>

<div class="rating rate" on:click|preventDefault={closePopups}>
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
