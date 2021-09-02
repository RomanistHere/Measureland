<script>
    import { overlayStateStore } from '../../stores/state.js';
    import { overlayStateDefault } from '../constants/overlayStateDefault.js';

    const closePopup = () =>
        overlayStateStore.update(state => overlayStateDefault);
</script>

<a href={"#"} class="rating__close" on:click|preventDefault={closePopup}>
    <span class="close"></span>
</a>
