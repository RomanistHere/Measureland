<script>
    import { _ } from "svelte-i18n";

    import TextPopup from "./TextPopup.svelte";
</script>

<TextPopup
    title={$_("checkEmailPopup.title")}
    text={$_("checkEmailPopup.text")}
    button={$_("checkEmailPopup.button")}
/>
