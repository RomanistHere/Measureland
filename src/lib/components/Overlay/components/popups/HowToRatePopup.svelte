<script>
    import PopupWrap from './PopupWrap.svelte';
    import MainButton from '../MainButton.svelte';

    import { closeOverlay, openAnotherOverlay } from "../../../../utilities/helpers.js";
    import { userStateStore } from "../../../../../stores/state.js";

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;
    const closePopup = () => closeOverlay('popup');
    const openLoginPopup = () => openAnotherOverlay('loginPopup');
</script>

<PopupWrap className='login__wrap'>
    <div class="rating__popup rating__popup-active">
        <h2 class="rating__title title rating__item_text sidebar__title">So you want to measure land</h2>
        <hr>
        <img src="../images/tutorial_gif.gif" alt="tutorial gif" class="rate_tutorial__image" width="410">
        <ul class="rate_tutorial__list partners__list">
            <li class="rate_tutorial__item partners__item">
                {#if isUserLoggedIn}
                    Find a needed town (search at the top left)
                {:else}
                    You need to <a href="#" class="footer__link" on:click|preventDefault={openLoginPopup}>register</a> first
                {/if}
            </li>
            <li class="rate_tutorial__item partners__item">
                Look for a place where you have experience of living
            </li>
            <li class="rate_tutorial__item partners__item">
                Click it! Or touch the screen
            </li>
            <li class="rate_tutorial__item partners__item">
                Rate all criteria in the appeared modal
            </li>
            <li class="rate_tutorial__item partners__item">
                Leave the comment and save
            </li>
        </ul>
        <MainButton text="Got ya, let's go!" action={closePopup} />
    </div>
</PopupWrap>
