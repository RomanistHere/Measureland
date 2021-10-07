<script>
    import { _, locale } from 'svelte-i18n';

    import TextLink from '../../../ui-elements/TextLink.svelte';
    import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import { closeOverlay } from "../../../../utilities/helpers.js";
    import { appInfo } from '../../../../../configs/index.js';

    const closePopup = () => closeOverlay('popup');
</script>

<div class="max-w-sm w-full">
    <PopupTitle title={$_('askForMoreRatingsPopup.title')} />

    <p class="my-2">
        {$_('askForMoreRatingsPopup.weProcessingRequest')}
        <TextLink
            href={$_('askForMoreRatingsPopup.url')}
            text={$_('askForMoreRatingsPopup.weProcessingRequestLink')}
            blank={true}
        />
        {$_('askForMoreRatingsPopup.weProcessingRequestAfterLink')}
    </p>

    <p class="my-2">
        {$_('askForMoreRatingsPopup.limitationsExist')}
        <TextLink
            href="/blog/how-to-become-citizen/"
            text={$_('askForMoreRatingsPopup.limitationsExistLink')}
            blank={true}
        />
    </p>

    <p class="my-2">
        {#if $locale === 'en'}
            {$_('askForMoreRatingsPopup.youCanTryFasten')}
            <TextLink
                href="mailto:{appInfo.supportEmail}"
                text={appInfo.supportEmail}
            />
        {/if}
        {$_('askForMoreRatingsPopup.orOurTelegramBot')}
        <TextLink
            href={appInfo.telegramBot}
            text={appInfo.telegramBot}
            blank={true}
        />
        {$_('askForMoreRatingsPopup.weWillRespond')}
    </p>

    <PrimaryButton text={$_('askForMoreRatingsPopup.mainBtn')} className="block text-center mt-4" action={closePopup} />
</div>
