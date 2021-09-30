<script>
    import { _, locale } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import MainButton from '../MainButton.svelte';

    import { closeOverlay } from "../../../../utilities/helpers.js";
    import { appInfo } from '../../../../../configs/index.js';

    const closePopup = () => closeOverlay('popup');
</script>

<PopupWrap className='rate_ask_ratings__wrap'>
    <div class="rating__popup rating__popup-active">
        <h2 class="rating__title title rating__item_text sidebar__title">
            {$_('askForMoreRatingsPopup.title')}
        </h2>
        <hr>
        <p class="rate_ask_ratings__text">
            {$_('askForMoreRatingsPopup.weProcessingRequest')}
            <a href="{$_('askForMoreRatingsPopup.url')}" target="_blank" rel="noopener" class="footer__link">
                {$_('askForMoreRatingsPopup.weProcessingRequestLink')}
            </a>
            {$_('askForMoreRatingsPopup.weProcessingRequestAfterLink')}
        </p>
        <p class="rate_ask_ratings__text">
            {$_('askForMoreRatingsPopup.limitationsExist')}
            <a href="/blog/how-to-become-citizen/" class="footer__link">
                {$_('askForMoreRatingsPopup.limitationsExistLink')}
            </a>
        </p>
        <p class="rate_ask_ratings__text">
            {#if $locale === 'en'}
                {$_('askForMoreRatingsPopup.youCanTryFasten')}
                <a href="mailto:{appInfo.supportEmail}" class="footer__link">{appInfo.supportEmail}</a>
            {:else}
            {/if}
            {$_('askForMoreRatingsPopup.orOurTelegramBot')}
            <a href="{appInfo.telegramBot}" target="_blank" rel="noopener" class="footer__link">{appInfo.telegramBot}</a>
            {$_('askForMoreRatingsPopup.weWillRespond')}
        </p>
        <MainButton text={$_('askForMoreRatingsPopup.mainBtn')} className="rate_ask_ratings__ok" action={closePopup} />
    </div>
</PopupWrap>
