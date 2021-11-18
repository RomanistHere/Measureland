<script>
    export let action;
    export let text = 'Submit';
    export let className = '';
    export let disabled = false;
</script>

<button
    type="submit"
    class="text-base lg:text-lg rounded-md py-2 px-4 {className}"
    class:cursor-default={disabled}
    class:opacity-60={disabled}
    on:click|preventDefault={action}
>
    {text}
</button>

<style>
    button {
        background-color: var(--active-color);
        color: var(--text-color-btn);
        transition: background-color .3s;
    }

    @media (hover: hover) and (pointer: fine) {
        button:not(.cursor-default):hover {
            background-color: var(--suc-color);
        }
    }
</style>
