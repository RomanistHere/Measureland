<script>
    export let text = '';
    export let href = '';
    export let className = '';
    export let blank = null;

    const target = blank ? '_blank' : null;
</script>

<a { href } { target } class="underline {className}">{text}</a>

<style>
    a {
        transition: color .2s;
    }

    @media (hover: hover) and (pointer: fine) {
        a:hover {
            color: var(--active-color);
        }
    }
</style>
