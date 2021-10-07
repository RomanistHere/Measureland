<script>
    export let text = '';
    export let href = '#';
    export let className = '';
    export let blank = null;

    const target = blank ? '_blank' : null;
    const rel = blank ? 'noopener' : null;
</script>

<a
    { href }
    { target }
    { rel }
    class="underline {className}"
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
            color: #fff;
            text-decoration: none;
        }
    }
</style>
