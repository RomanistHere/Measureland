<script>
    import { _ } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import MainButton from '../MainButton.svelte';

    import { closeOverlay, openAnotherOverlay } from "../../../../utilities/helpers.js";
    import { userStateStore } from "../../../../../stores/state.js";

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;
    const closePopup = () => closeOverlay('popup');
    const openLoginPopup = () => openAnotherOverlay('loginPopup');
</script>

<PopupWrap className='rate_tutorial__wrap'>
    <div class="rating__popup rating__popup-active">
        <h2 class="rating__title title rating__item_text sidebar__title">{$_('howToRatePopup.soYouWantTo')}</h2>
        <hr>
        <img src="../images/tutorial_gif.gif" alt="{$_('howToRatePopup.gifAltText')}" class="rate_tutorial__image" width="410">
        <ul class="rate_tutorial__list partners__list">
            <li class="rate_tutorial__item partners__item">
                {#if isUserLoggedIn}
                    {$_('howToRatePopup.findNeededTown')}
                {:else}
                <!-- todo: check how to do it in an adequate way -->
                    {$_('howToRatePopup.youNeedTo')} <a href={"#"} class="footer__link" on:click|preventDefault={openLoginPopup}>{$_('howToRatePopup.register')}</a> {$_('howToRatePopup.first')}
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
        <MainButton text="{$_('howToRatePopup.submit')}" action={closePopup} />
    </div>
</PopupWrap>
