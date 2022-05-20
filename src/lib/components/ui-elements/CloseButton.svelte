<script>
    import { closeOverlay } from "../../utilities/helpers.js";
    import { isDesktop } from "../../../stores/state.js";

    export let overlayType = null;
    export let className = "";

    const close = () => closeOverlay(overlayType);
</script>

<button class="close_wrap absolute top-7 right-6 leading-3 p-1 {className}" on:click={close}>
    <span class="close w-6 h-6 relative inline-block -lg:w-7 -lg:h-7"></span>
    {#if $isDesktop && overlayType === "popup"}
        <span class="absolute left-1/2 -bottom-4 transform -translate-x-1/2 text-sm">esc</span>
    {/if}
</button>

<style>
    .close::before,
    .close::after {
        content: "";
        position: absolute;

        width: 100%;
        height: 3px;
        top: 50%;
        left: 50%;

        border-radius: 100%;
        transform: translate(-50%, -50%);

        background-color: var(--text-color);
        transition: background-color .2s;
    }

    .close::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .close::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    @media (hover: hover) and (pointer: fine) {
        .close_wrap:hover .close::after,
        .close_wrap:hover .close::before {
            background-color: var(--active-color);
        }
    }
</style>
