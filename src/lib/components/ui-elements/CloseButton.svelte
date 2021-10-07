<script>
    import { closeOverlay } from '../../utilities/helpers.js';

    export let overlayType = null;
    export let className = '';

    const close = () => closeOverlay(overlayType);
</script>

<a href={"#"} class="absolute top-7 right-6 leading-3 p-1 {className}" on:click|preventDefault={close}>
    <span class="close w-6 h-6 relative inline-block -lg:w-7 -lg:h-7"></span>
</a>

<style>
    .close::before,
    .close::after {
        content: "";
        position: absolute;

        width: 100%;
        height: 3px;
        top: 50%;
        left: 50%;
        /* border-radius: 5px 0; */
        border-radius: 100%;
        transform: translate(-50%, -50%);

        background-color: var(--sug-color);
        transition: background-color .2s;
    }

    .close::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .close::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    @media (hover: hover) and (pointer: fine) {
        .close:hover::after,
        .close:hover::before {
            background-color: var(--active-color);
        }
    }
</style>
