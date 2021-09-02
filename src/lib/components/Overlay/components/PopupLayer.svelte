<script>
    import { onMount } from 'svelte';

    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';

    export let popupName;
    export let popupData;
    let Popup;

    const popupList = {
        // loginPopup: PopupLayer,
        // registerPopup: PopupLayer,
        // forgotPasswordPopup: PopupLayer,
        // changePasswordPopup: PopupLayer,
        showRatingsPopup: ShowRatingPopup,
        // quizPopup: PopupLayer,
    };

    onMount(() => {
        // console.log(popupName, popupData);
		Popup = popupList[popupName];

        return () => Popup = null;
	});
</script>

<div class="rating rate">
    <svelte:component this={Popup} {popupData}/>
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
