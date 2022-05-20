<script>
    export let action;
    export let text = "Submit";
    export let className = "";
    export let disabled = false;
</script>

<button
    type="submit"
    class="text-base lg:text-lg rounded-md py-2 px-4 bg-active text-white transition-colors {className}"
    class:cursor-default={disabled}
    class:opacity-60={disabled}
    on:click={action}
>
    {text}
</button>

<style>
    @media (hover: hover) and (pointer: fine) {
        button:not(.cursor-default):hover {
            background-color: var(--suc-color);
        }
    }
</style>
