<script>
    import { closeOverlay } from '../utilities/helpers.js';

    export let overlayType = null;

    const close = () => closeOverlay(overlayType);
</script>

<a href={"#"} class="rating__close" on:click|preventDefault={close}>
    <span class="close"></span>
</a>
