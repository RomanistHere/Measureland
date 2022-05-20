<script>
    import { fly } from "svelte/transition";

    export let tooltip;

    let showTooltip = false;
</script>

<div
    class="info relative z-2 inline-block text-center font-bold rounded-full"
    on:mouseenter={() => { showTooltip = true }}
    on:mouseleave={() => { showTooltip = false }}
>
    ?
    {#if showTooltip}
        <span
            class="info__tooltip text-xs w-32 -left-14 absolute z-1 pointer-events-none px-2 py-1 rounded-md font-normal"
            in:fly="{{ y: 10, duration: 200 }}"
            out:fly="{{ y: -10, duration: 200 }}"
        >
            {tooltip}
        </span>
    {/if}
</div>

<style>
    .info {
        font-family: sans-serif;
        font-size: 0.8em;
        line-height: 0.8em;

        padding: 0.13em 0.2em 0.09em 0.2em;
        border: 1px solid;
    }

    .info__tooltip {
        background-color: var(--text-color);

        color: var(--side-bg-color);

        transition: opacity .6s;

        bottom: 160%;
    }

    .info__tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--text-color) transparent transparent transparent;
    }
</style>
