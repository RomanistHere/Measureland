<script>
    import { _ } from "svelte-i18n";

    import TextPopup from "./TextPopup.svelte";
</script>

<TextPopup
    title={$_("confirmForgotPasswordPopup.title")}
    text={$_("confirmForgotPasswordPopup.text")}
    button={$_("confirmForgotPasswordPopup.button")}
/>
