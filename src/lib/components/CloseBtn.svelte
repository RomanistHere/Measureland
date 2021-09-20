<script>
    import { closeOverlay } from '../utilities/helpers.js';

    export let overlayType = null;
    export let className = '';

    const close = () => closeOverlay(overlayType);
</script>

<a href={"#"} class="rating__close {className}" on:click|preventDefault={close}>
    <span class="close"></span>
</a>
