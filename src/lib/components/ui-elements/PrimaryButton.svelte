<script>
    export let action;
    export let text = '';
    export let className = '';
    export let disabled = false;
</script>

<a
    href={"#"}
    class="text-base lg:text-lg text-center rounded-md py-2 px-8 transition-colors bg-active text-white -md:px-4 {className}"
    class:cursor-default={disabled}
    class:opacity-60={disabled}
    on:click|preventDefault={action}
>
    {text}
</a>

<style>
    /* can be passed from SecondaryButton.svelte */
    .secondary {
        background: none;
        border-bottom: 1px solid var(--non-active-color);

        transition: border-color ease .3s;

        color: var(--text-color);
    }

    @media (hover: hover) and (pointer: fine) {
        a:not(.secondary):not(.cursor-default):hover {
            background-color: var(--suc-color);
        }

        .secondary:not(.cursor-default):hover {
            border-color: var(--text-color);
        }
    }
</style>
