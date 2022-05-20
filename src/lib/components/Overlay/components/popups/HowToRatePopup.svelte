<script>
    import { _, locale } from "svelte-i18n";

    import PopupTitle from "./PopupTitle.svelte";
    import PrimaryButton from "../../../ui-elements/PrimaryButton.svelte";
    import TextButton from "../../../ui-elements/TextButton.svelte";

    import { closeOverlay, openAnotherOverlay } from "../../../../utilities/helpers.js";
    import { userStateStore } from "../../../../../stores/state.js";

    const isUserLoggedIn = $userStateStore.userID !== null;
    const closePopup = () => closeOverlay("popup");
    const openLoginPopup = () => openAnotherOverlay("loginPopup");
</script>

<div class="max-w-sm w-full">
    <PopupTitle title={$_("howToRatePopup.soYouWantTo")} />

    <img src={`../images/tutorial_gif${$locale === "en" ? "-en" : ""}.gif`} alt="{$_('howToRatePopup.gifAltText')}" class="w-full mt-4" width="410">

    <ul class="my-4 list-inside list-decimal">
        <li>
            {#if isUserLoggedIn}
                {$_("howToRatePopup.findNeededTown")}
            {:else}
                {$_("howToRatePopup.youNeedTo")}
                <TextButton
                    text={$_("howToRatePopup.register")}
                    action={openLoginPopup}
                />
                {$_("howToRatePopup.first")}
            {/if}
        </li>
        <li>
            {$_("howToRatePopup.lookForPlace")}
        </li>
        <li>
            {$_("howToRatePopup.clickIt")}
        </li>
        <li>
            {$_("howToRatePopup.rateAllCriteria")}
        </li>
        <li>
            {$_("howToRatePopup.leaveTheComment")}
        </li>
    </ul>

    <div class="flex justify-evenly items-center mt-4">
        <PrimaryButton
            text="{$_('howToRatePopup.submit')}"
            className='block text-center px-10'
            action={closePopup}
        />
    </div>
</div>
