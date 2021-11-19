<script>
    export let text = '';
    export let className = '';
    export let href = '#';
    export let action;
</script>

<a
    { href }
    class="underline {className}"
    on:click|preventDefault={action}
>
    {text}
</a>

<style>
    a {
        transition: background-color .2s, color .2s;
    }

    @media (hover: hover) and (pointer: fine) {
        a:hover {
            background-color: var(--active-color);
            color: var(--text-color-btn);
            text-decoration: none;
        }
    }
</style>
