<script>
    import { _ } from 'svelte-i18n';

    import PopupTitle from './PopupTitle.svelte';
    import MainButton from '../MainButton.svelte';

    import { closeOverlay, openAnotherOverlay } from "../../../../utilities/helpers.js";
    import { userStateStore } from "../../../../../stores/state.js";

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;
    const closePopup = () => closeOverlay('popup');
    const openLoginPopup = () => openAnotherOverlay('loginPopup');
</script>

<div class="max-w-sm w-full">
    <PopupTitle title={$_('howToRatePopup.soYouWantTo')} />

    <img src="../images/tutorial_gif.gif" alt="{$_('howToRatePopup.gifAltText')}" class="w-full mt-4" width="410">

    <ul class="rate_tutorial__list partners__list">
        <li class="rate_tutorial__item partners__item">
            {#if isUserLoggedIn}
                {$_('howToRatePopup.findNeededTown')}
            {:else}
            <!-- todo: check how to do it in an adequate way -->
                {$_('howToRatePopup.youNeedTo')}
                <a href={"#"} class="underline" on:click|preventDefault={openLoginPopup}>{$_('howToRatePopup.register')}</a>
                {$_('howToRatePopup.first')}
            {/if}
        </li>
        <li class="rate_tutorial__item partners__item">
            {$_('howToRatePopup.lookForPlace')}
        </li>
        <li class="rate_tutorial__item partners__item">
            {$_('howToRatePopup.clickIt')}
        </li>
        <li class="rate_tutorial__item partners__item">
            {$_('howToRatePopup.rateAllCriteria')}
        </li>
        <li class="rate_tutorial__item partners__item">
            {$_('howToRatePopup.leaveTheComment')}
        </li>
    </ul>

    <div class="flex justify-evenly items-center mt-4">
        <MainButton
            text="{$_('howToRatePopup.submit')}"
            className='block text-center px-10'
            action={closePopup}
        />
    </div>
</div>
