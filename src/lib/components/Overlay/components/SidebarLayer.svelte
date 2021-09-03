<script>
    import { onMount } from 'svelte';

    import { overlayStateStore } from '../../../../stores/state.js';
    import { overlayStateDefault } from '../../../constants/overlayStateDefault.js';

    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';

    export let overlayName;
    export let overlayData;
    let Sidebar;

    const sidebarList = {
        // loginPopup: PopupLayer,
        // registerPopup: PopupLayer,
        // forgotPasswordPopup: PopupLayer,
        // changePasswordPopup: PopupLayer,
        showRatingsPopup: ShowRatingPopup,
        // quizPopup: PopupLayer,
    };

    const closePopups = e =>
        (e.target === e.currentTarget) ? overlayStateStore.update(state => overlayStateDefault) : false;

    onMount(() => {
        // console.log(overlayName, overlayData);
		Sidebar = popupList[overlayName];

        return () => Sidebar = null;
	});
</script>

<div class="rating rate" on:click|preventDefault={closePopups}>
    <svelte:component this={Sidebar} { overlayData }/>
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
